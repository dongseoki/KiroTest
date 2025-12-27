import { StorageService, AppError, DataCorruptionError } from '@/types';

/**
 * LocalStorageService implements the StorageService interface
 * Provides JSON serialization/deserialization, data validation, and error handling
 * Requirements: 5.1, 5.2, 5.4
 */
export class LocalStorageService implements StorageService {
  private readonly STORAGE_PREFIX = 'back-health-';
  private readonly BACKUP_KEY = 'backup-data';
  private readonly VERSION_KEY = 'data-version';
  private readonly CURRENT_VERSION = '1.0.0';

  /**
   * Save data to localStorage with JSON serialization
   * Requirement 5.1: 데이터를 입력하면 로컬 스토리지에 즉시 저장
   * Requirement 5.2: JSON 형식으로 인코딩
   */
  async save<T>(key: string, data: T): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedData = this.serialize(data);
      
      // Validate serialized data
      if (serializedData === null || serializedData === undefined) {
        throw new Error(`Failed to serialize data for key: ${key}`);
      }

      localStorage.setItem(prefixedKey, serializedData);
      
      // Update version info
      localStorage.setItem(this.getPrefixedKey(this.VERSION_KEY), this.CURRENT_VERSION);
      
    } catch (error) {
      const appError: AppError = {
        code: 'STORAGE_SAVE_ERROR',
        message: `Failed to save data for key ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        context: { key, dataType: typeof data }
      };
      
      console.error('LocalStorageService save error:', appError);
      throw appError;
    }
  }

  /**
   * Load data from localStorage with JSON deserialization
   * Requirement 5.3: 앱 재시작 후 저장된 데이터를 자동으로 로드
   */
  async load<T>(key: string): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedData = localStorage.getItem(prefixedKey);
      
      if (serializedData === null) {
        return null;
      }

      let deserializedData: T;
      try {
        deserializedData = this.deserialize<T>(serializedData);
      } catch (deserializationError) {
        // Treat deserialization errors as data corruption
        const corruptionError: DataCorruptionError = {
          code: 'DATA_CORRUPTION',
          message: `Corrupted data detected for key: ${key}`,
          timestamp: new Date(),
          context: { key, serializedData },
          corruptedData: serializedData,
          recoveryAttempted: false
        };
        throw corruptionError;
      }
      
      // Validate deserialized data
      if (!this.validateData(deserializedData)) {
        const corruptionError: DataCorruptionError = {
          code: 'DATA_CORRUPTION',
          message: `Corrupted data detected for key: ${key}`,
          timestamp: new Date(),
          context: { key, serializedData },
          corruptedData: serializedData,
          recoveryAttempted: false
        };
        throw corruptionError;
      }

      return deserializedData;
      
    } catch (error) {
      if (this.isDataCorruptionError(error)) {
        // Requirement 5.4: 데이터 손상이 감지되면 오류를 기록하고 기본값으로 복구
        return this.handleDataCorruption(key, error);
      }
      
      const appError: AppError = {
        code: 'STORAGE_LOAD_ERROR',
        message: `Failed to load data for key ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        context: { key }
      };
      
      console.error('LocalStorageService load error:', appError);
      throw appError;
    }
  }

  /**
   * Remove data from localStorage
   */
  async remove(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      const appError: AppError = {
        code: 'STORAGE_REMOVE_ERROR',
        message: `Failed to remove data for key ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        context: { key }
      };
      
      console.error('LocalStorageService remove error:', appError);
      throw appError;
    }
  }

  /**
   * Clear all app data from localStorage
   */
  async clear(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      
      // Find all keys with our prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all found keys
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
    } catch (error) {
      const appError: AppError = {
        code: 'STORAGE_CLEAR_ERROR',
        message: `Failed to clear storage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      
      console.error('LocalStorageService clear error:', appError);
      throw appError;
    }
  }

  /**
   * Create a backup of all app data
   */
  async backup(): Promise<string> {
    try {
      const backupData: Record<string, any> = {};
      
      // Collect all app data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            // Remove prefix for backup
            const cleanKey = key.replace(this.STORAGE_PREFIX, '');
            backupData[cleanKey] = value;
          }
        }
      }
      
      const backupJson = JSON.stringify({
        version: this.CURRENT_VERSION,
        timestamp: new Date().toISOString(),
        data: backupData
      });
      
      // Save backup to localStorage as well
      localStorage.setItem(this.getPrefixedKey(this.BACKUP_KEY), backupJson);
      
      return backupJson;
      
    } catch (error) {
      const appError: AppError = {
        code: 'STORAGE_BACKUP_ERROR',
        message: `Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      
      console.error('LocalStorageService backup error:', appError);
      throw appError;
    }
  }

  /**
   * Restore data from backup
   */
  async restore(backupData: string): Promise<void> {
    try {
      const backup = JSON.parse(backupData);
      
      if (!backup.data || typeof backup.data !== 'object') {
        throw new Error('Invalid backup format');
      }
      
      // Clear existing data first
      await this.clear();
      
      // Restore data
      Object.entries(backup.data).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(this.getPrefixedKey(key), value);
        }
      });
      
      // Update version
      localStorage.setItem(this.getPrefixedKey(this.VERSION_KEY), backup.version || this.CURRENT_VERSION);
      
    } catch (error) {
      const appError: AppError = {
        code: 'STORAGE_RESTORE_ERROR',
        message: `Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        context: { backupData: backupData.substring(0, 100) + '...' }
      };
      
      console.error('LocalStorageService restore error:', appError);
      throw appError;
    }
  }

  /**
   * Serialize data to JSON string
   * Requirement 5.2: JSON 형식으로 인코딩
   */
  private serialize<T>(data: T): string {
    try {
      return JSON.stringify(data, this.dateReplacer);
    } catch (error) {
      throw new Error(`Serialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deserialize JSON string to data
   * Requirement 5.2: JSON 형식으로 인코딩 (역직렬화)
   */
  private deserialize<T>(serializedData: string): T {
    try {
      return JSON.parse(serializedData, this.dateReviver);
    } catch (error) {
      throw new Error(`Deserialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * JSON replacer function to handle Date objects
   */
  private dateReplacer(_key: string, value: any): any {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  }

  /**
   * JSON reviver function to restore Date objects
   */
  private dateReviver(_key: string, value: any): any {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    // Also handle ISO date strings directly (fallback)
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return new Date(value);
    }
    return value;
  }

  /**
   * Type guard to check if error is DataCorruptionError
   */
  private isDataCorruptionError(error: any): error is DataCorruptionError {
    return error && 
           typeof error === 'object' && 
           error.code === 'DATA_CORRUPTION' &&
           'corruptedData' in error &&
           'recoveryAttempted' in error;
  }

  /**
   * Get prefixed key for localStorage
   */
  private getPrefixedKey(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`;
  }

  /**
   * Basic data validation
   */
  private validateData(data: any): boolean {
    // Basic validation - check if data is not null/undefined
    // and can be serialized again (round-trip test)
    if (data === null || data === undefined) {
      return true; // null/undefined are valid
    }
    
    try {
      const serialized = this.serialize(data);
      const deserialized = this.deserialize(serialized);
      return true; // If we can round-trip, data is valid
    } catch {
      return false;
    }
  }

  /**
   * Handle data corruption by attempting recovery
   * Requirement 5.4: 데이터 손상이 감지되면 오류를 기록하고 기본값으로 복구
   */
  private async handleDataCorruption<T>(key: string, error: DataCorruptionError): Promise<T | null> {
    console.error('Data corruption detected:', error);
    
    // Mark recovery as attempted
    error.recoveryAttempted = true;
    
    // Try to recover from backup
    try {
      const backupKey = this.getPrefixedKey(this.BACKUP_KEY);
      const backupData = localStorage.getItem(backupKey);
      
      if (backupData) {
        const backup = JSON.parse(backupData);
        const cleanKey = key.replace(this.STORAGE_PREFIX, '');
        
        if (backup.data && backup.data[cleanKey]) {
          console.log(`Attempting recovery from backup for key: ${key}`);
          const recoveredData = this.deserialize<T>(backup.data[cleanKey]);
          
          // Save recovered data
          await this.save(key.replace(this.STORAGE_PREFIX, ''), recoveredData);
          
          return recoveredData;
        }
      }
    } catch (recoveryError) {
      console.error('Backup recovery failed:', recoveryError);
    }
    
    // If backup recovery fails, remove corrupted data and return null (default)
    try {
      await this.remove(key.replace(this.STORAGE_PREFIX, ''));
    } catch (removeError) {
      console.error('Failed to remove corrupted data:', removeError);
    }
    
    console.log(`Data corruption recovery completed for key: ${key}. Returning default value (null).`);
    return null;
  }
}
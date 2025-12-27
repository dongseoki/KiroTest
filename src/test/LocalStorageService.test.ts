import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageService } from '@/services/LocalStorageService';
import { HealthRecord, PainLocation } from '@/types';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    service = new LocalStorageService();
  });

  describe('Basic Operations', () => {
    it('should save and load simple data', async () => {
      const testData = { name: 'test', value: 42 };
      
      await service.save('test-key', testData);
      const loaded = await service.load<typeof testData>('test-key');
      
      expect(loaded).toEqual(testData);
    });

    it('should return null for non-existent keys', async () => {
      const result = await service.load('non-existent-key');
      expect(result).toBeNull();
    });

    it('should remove data correctly', async () => {
      await service.save('test-key', { data: 'test' });
      await service.remove('test-key');
      
      const result = await service.load('test-key');
      expect(result).toBeNull();
    });

    it('should clear all app data', async () => {
      await service.save('key1', { data: 'test1' });
      await service.save('key2', { data: 'test2' });
      
      await service.clear();
      
      const result1 = await service.load('key1');
      const result2 = await service.load('key2');
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('Date Handling', () => {
    it('should properly serialize and deserialize Date objects', async () => {
      const testDate = new Date('2024-01-15T10:30:00Z');
      const testData = {
        timestamp: testDate,
        name: 'test'
      };
      
      await service.save('date-test', testData);
      const loaded = await service.load<typeof testData>('date-test');
      
      expect(loaded).not.toBeNull();
      expect(loaded!.timestamp).toBeInstanceOf(Date);
      expect(loaded!.timestamp.getTime()).toBe(testDate.getTime());
      expect(loaded!.name).toBe('test');
    });
  });

  describe('Complex Data Structures', () => {
    it('should handle HealthRecord objects correctly', async () => {
      const painLocation: PainLocation = {
        area: 'lower',
        side: 'left',
        intensity: 7
      };

      const healthRecord: HealthRecord = {
        id: 'test-id',
        date: new Date('2024-01-15'),
        painLevel: 8,
        painLocation: [painLocation],
        notes: 'Test pain record',
        timestamp: Date.now()
      };

      await service.save('health-record', healthRecord);
      const loaded = await service.load<HealthRecord>('health-record');

      expect(loaded).not.toBeNull();
      expect(loaded!.id).toBe(healthRecord.id);
      expect(loaded!.painLevel).toBe(healthRecord.painLevel);
      expect(loaded!.date).toBeInstanceOf(Date);
      expect(loaded!.date.getTime()).toBe(healthRecord.date.getTime());
      expect(loaded!.painLocation).toHaveLength(1);
      expect(loaded!.painLocation[0]).toEqual(painLocation);
      expect(loaded!.notes).toBe(healthRecord.notes);
      expect(loaded!.timestamp).toBe(healthRecord.timestamp);
    });
  });

  describe('Backup and Restore', () => {
    it('should create and restore backups', async () => {
      const testData1 = { name: 'test1', value: 1 };
      const testData2 = { name: 'test2', value: 2 };
      
      await service.save('data1', testData1);
      await service.save('data2', testData2);
      
      const backup = await service.backup();
      expect(backup).toBeTruthy();
      expect(typeof backup).toBe('string');
      
      // Clear data
      await service.clear();
      
      // Restore from backup
      await service.restore(backup);
      
      const restored1 = await service.load('data1');
      const restored2 = await service.load('data2');
      
      expect(restored1).toEqual(testData1);
      expect(restored2).toEqual(testData2);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      // Manually insert invalid JSON
      localStorage.setItem('back-health-invalid', 'invalid-json{');
      
      // Should not throw, but return null after corruption recovery
      const result = await service.load('invalid');
      expect(result).toBeNull(); // Should return null after corruption recovery
    });

    it('should throw error for save failures', async () => {
      // Mock localStorage.setItem to throw
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage full');
      });

      await expect(service.save('test', { data: 'test' })).rejects.toThrow();
      
      // Restore original method
      localStorage.setItem = originalSetItem;
    });
  });
});
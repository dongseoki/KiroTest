import { HealthRecord, DateRange } from '@/types';

export interface IHealthRecordManager {
  addRecord(record: Omit<HealthRecord, 'id' | 'timestamp'>): Promise<HealthRecord>;
  getRecords(dateRange?: DateRange): Promise<HealthRecord[]>;
  updateRecord(id: string, updates: Partial<HealthRecord>): Promise<HealthRecord>;
  deleteRecord(id: string): Promise<void>;
}
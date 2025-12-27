import { ProgressMetrics, HealthRecord, ExerciseSession, ChartData, TimePeriod } from '@/types';

export interface IProgressTracker {
  calculateMetrics(records: HealthRecord[], sessions: ExerciseSession[]): ProgressMetrics;
  generateChartData(records: HealthRecord[], period: TimePeriod): ChartData;
  getInsights(metrics: ProgressMetrics): string[];
}
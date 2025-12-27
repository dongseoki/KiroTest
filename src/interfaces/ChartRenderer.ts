import { HealthRecord, ExerciseSession, ChartData } from '@/types';

export interface IChartRenderer {
  renderPainTrendChart(records: HealthRecord[]): HTMLCanvasElement;
  renderExerciseProgressChart(sessions: ExerciseSession[]): HTMLCanvasElement;
  renderPainLocationHeatmap(records: HealthRecord[]): HTMLCanvasElement;
  updateChart(chartId: string, newData: ChartData): void;
}
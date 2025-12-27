import { ViewportConfig, ChartOptions } from '@/types';

export interface IResponsiveUI {
  detectViewport(): keyof ViewportConfig;
  adaptLayout(viewport: keyof ViewportConfig): void;
  optimizeChartSize(viewport: keyof ViewportConfig): ChartOptions;
}
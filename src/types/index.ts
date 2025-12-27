// Core type definitions for the back health management system

export interface HealthRecord {
  id: string;
  date: Date;
  painLevel: number; // 1-10 scale
  painLocation: PainLocation[];
  notes?: string;
  timestamp: number;
}

export interface PainLocation {
  area: 'upper' | 'middle' | 'lower';
  side: 'left' | 'right' | 'center';
  intensity: number; // 1-10 scale
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // seconds
  difficulty: 'low' | 'medium' | 'high';
  targetPainLevel: number[]; // applicable pain levels
  instructions: string[];
  videoUrl?: string;
}

export interface ExerciseSession {
  id: string;
  exercises: Exercise[];
  totalDuration: number;
  completedAt?: Date;
  painLevelBefore?: number;
  painLevelAfter?: number;
}

export interface ProgressMetrics {
  averagePainLevel: number;
  painTrend: 'improving' | 'stable' | 'worsening';
  exerciseCompliance: number; // percentage
  streakDays: number;
  totalExerciseSessions: number;
}

export interface TimerState {
  currentExercise: Exercise | null;
  remainingTime: number;
  isRunning: boolean;
  isPaused: boolean;
  sessionProgress: number; // 0-100
}

export interface UserProfile {
  id: string;
  createdAt: Date;
  preferences: {
    reminderTime?: string; // HH:MM format
    exerciseDifficulty: 'beginner' | 'intermediate' | 'advanced';
    painScale: 'numeric' | 'visual';
  };
  medicalHistory?: {
    conditions: string[];
    medications: string[];
    physicalLimitations: string[];
  };
}

export interface AppState {
  currentView: 'dashboard' | 'record' | 'exercise' | 'progress';
  isOnline: boolean;
  lastSync: Date;
  activeSession?: ExerciseSession;
  notifications: Notification[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  dataRetentionDays: number;
  autoBackup: boolean;
  offlineMode: boolean;
}

// Utility types
export interface DateRange {
  start: Date;
  end: Date;
}

export type TimePeriod = 'week' | 'month' | 'quarter' | 'year';

export interface SessionFeedback {
  painLevelAfter: number;
  difficulty: 'too_easy' | 'just_right' | 'too_hard';
  notes?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  scales?: any;
  plugins?: any;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'radar';
  data: ChartData;
  options: ChartOptions;
}

export interface ViewportConfig {
  mobile: { maxWidth: 768 };
  tablet: { minWidth: 769; maxWidth: 1024 };
  desktop: { minWidth: 1025 };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  timestamp: Date;
  context?: any;
}

export interface DataCorruptionError extends AppError {
  corruptedData: any;
  recoveryAttempted: boolean;
}

export interface RecoveryResult {
  success: boolean;
  recoveredData?: any;
  message: string;
}

// Storage interface
export interface StorageService {
  save<T>(key: string, data: T): Promise<void>;
  load<T>(key: string): Promise<T | null>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  backup(): Promise<string>; // JSON export
  restore(backupData: string): Promise<void>;
}

// Validation schemas
export const HealthRecordSchema = {
  painLevel: { type: 'number', min: 1, max: 10, required: true },
  painLocation: { type: 'array', minItems: 1, required: true },
  date: { type: 'date', required: true },
  notes: { type: 'string', maxLength: 500, required: false }
} as const;

export const ExerciseSchema = {
  name: { type: 'string', minLength: 1, maxLength: 100, required: true },
  duration: { type: 'number', min: 10, max: 3600, required: true },
  difficulty: { type: 'enum', values: ['low', 'medium', 'high'], required: true }
} as const;
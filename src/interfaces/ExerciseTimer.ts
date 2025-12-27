import { ExerciseSession, TimerState } from '@/types';

export interface IExerciseTimer {
  startSession(session: ExerciseSession): void;
  pauseTimer(): void;
  resumeTimer(): void;
  skipExercise(): void;
  completeSession(): void;
  onTimerUpdate(callback: (state: TimerState) => void): void;
}
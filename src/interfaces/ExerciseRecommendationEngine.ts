import { Exercise, ExerciseSession, HealthRecord, SessionFeedback } from '@/types';

export interface IExerciseRecommendationEngine {
  getRecommendations(painLevel: number, history?: HealthRecord[]): Exercise[];
  createSession(exercises: Exercise[]): ExerciseSession;
  completeSession(sessionId: string, feedback: SessionFeedback): Promise<void>;
}
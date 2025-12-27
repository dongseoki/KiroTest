import { AppError, RecoveryResult } from '@/types';

export interface IErrorRecoveryStrategy {
  canRecover(error: AppError): boolean;
  recover(error: AppError): Promise<RecoveryResult>;
  fallback(error: AppError): void;
}
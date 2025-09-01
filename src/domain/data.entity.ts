import { LogLevel } from './vo/log-level';

export class DataEntity {
  key: string;
  level: LogLevel;
  message: string;
  currentPatched: number;
  timestamp?: Date | null;
  errorId?: string | null;
}

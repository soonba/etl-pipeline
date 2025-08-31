import { LogLevel } from './vo/log-level';

export class DataEntity {
  source: string;
  level: LogLevel;
  message: string;
  timestamp?: Date | null;
  errorId?: string | null;
}

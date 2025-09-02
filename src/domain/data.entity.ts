import { LogLevel } from './vo/log-level';

export class DataEntity {
  key: string;
  level: LogLevel;
  message: string;
  timestamp?: Date | null;
  errorId?: string | null;
}

import { LogLevel } from 'src/domain/vo/log-level';

const winstonToLogLevelMap: Record<string, LogLevel> = {
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
};

export const mapWinstonLogLevel = (level: string): LogLevel => {
  return winstonToLogLevelMap[level] ?? LogLevel.INVALID_DATA;
};

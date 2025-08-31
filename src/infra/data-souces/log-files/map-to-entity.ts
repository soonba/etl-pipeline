import { DataEntity } from '../../../domain/data.entity';
import * as dayjs from 'dayjs';

import { LogLevel } from 'src/domain/vo/log-level';
import { WinstonLoggerType } from './winston-logger.type';

const winstonToLogLevelMap: Record<string, LogLevel> = {
  info: LogLevel.INFO,
  warn: LogLevel.WARN,
  error: LogLevel.ERROR,
};

export const mapWinstonLogLevel = (level: string): LogLevel => {
  return winstonToLogLevelMap[level] ?? LogLevel.INVALID_DATA;
};

export const mapToEntity = (winstonLogger: WinstonLoggerType): DataEntity => {
  const { raw, date, level, message, payload } = winstonLogger;
  return {
    source: 'winston-logger',
    level: mapWinstonLogLevel(level),
    message: raw + message,
    timestamp: date ? dayjs(date).toDate() : null,
    errorId: payload?.pid,
  };
};

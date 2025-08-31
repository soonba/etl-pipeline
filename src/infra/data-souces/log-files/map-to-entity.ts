import { WinstonLoggerType } from '../types';
import { DataEntity } from '../../../domain/data.entity';
import { mapWinstonLogLevel } from './map-to-log-level';
import * as dayjs from 'dayjs';

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

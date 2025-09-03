import { WinstonLoggerType } from './winston-logger.type';
import { parseRaw } from './parse-raw';

export const parseLogLine = (raw: string): WinstonLoggerType => {
  try {
    const parsed = parseRaw(raw);
    const [, date, level, message, payloadStr] = parsed;

    const payload: { pid: string; page: number } = JSON.parse(payloadStr) as { pid: string; page: number };
    return {
      raw,
      date,
      level: level as 'info' | 'warn' | 'error',
      message,
      payload,
    };
  } catch {
    return {
      level: 'invalid',
      raw,
      message: 'invalid data',
    };
  }
};

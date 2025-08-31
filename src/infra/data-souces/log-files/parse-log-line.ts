import { WinstonLoggerType } from '../types';

export const parseLogLine = (raw: string): WinstonLoggerType => {
  const regex = /^(\d{8})\s+(info|warn|error):\s+(.*?)\s+(\{.*})$/;
  const match = raw.match(regex);
  if (!match) {
    return {
      level: 'invalid',
      raw,
      message: 'invalid data',
    };
  }
  const [, date, level, message, payloadStr] = match;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: { pid: string; page: number } = JSON.parse(payloadStr);
    return {
      raw,
      date,
      level: level as 'info' | 'warn' | 'error',
      message,
      payload,
    };
  } catch (e: any) {
    return {
      level: 'invalid',
      raw,
      message: 'invalid data',
    };
  }
};

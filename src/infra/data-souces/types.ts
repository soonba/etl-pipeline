export interface Api3010Type {}
export interface Api3011Type {}
export interface WinstonLoggerType {
  raw: string; // 원본
  date?: string; // YYYYMMDD
  level: 'info' | 'warn' | 'error' | 'invalid';
  message: string; // [OK] log-283 processed successfully
  payload?: { pid: string; page: number }; // {"pid":1032,"page":83,...}
}

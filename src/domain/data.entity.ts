export class DataEntity {
  source: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  errorId?: string | null;
}

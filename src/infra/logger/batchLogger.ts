export interface BatchLogger {
  log(message: string, context?: any): void;
  error(message: string, context?: any): void;
}

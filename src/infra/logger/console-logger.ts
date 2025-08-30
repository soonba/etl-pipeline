import { Injectable } from '@nestjs/common';
import { BatchLogger } from './batchLogger';

@Injectable()
export class ConsoleLogger implements BatchLogger {
  log(message: string, context?: any): void {
    console.log(message, context);
  }
  error(message: string, stack?: string, context?: any): void {
    console.log(message, stack, context);
  }
}

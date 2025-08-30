import { Module } from '@nestjs/common';
import { ConsoleLogger } from './console-logger';

export const LOGGER = Symbol('LOGGER');

@Module({
  providers: [
    {
      provide: LOGGER,
      useClass: ConsoleLogger,
    },
  ],
  exports: [LOGGER],
})
export class LoggerModule {}

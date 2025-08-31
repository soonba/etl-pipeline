import { Module } from '@nestjs/common';
import { Api3010Port } from './apis/api3010/api-3010-port';
import { Api3011Port } from './apis/api3011/api-3011-port';
import { WinstonLoggerSource } from './log-files/winston-logger-source';

export const DATA_SOURCES = Symbol('DATA_SOURCES');
export const REACTIVE_DATA_SOURCES = Symbol('DATA_SOURCES');

@Module({
  providers: [
    Api3010Port,
    Api3011Port,
    WinstonLoggerSource,
    {
      provide: DATA_SOURCES,
      useFactory: (a1: Api3010Port) => [],
      inject: [Api3010Port],
    },
    {
      provide: REACTIVE_DATA_SOURCES,
      useFactory: (a2: Api3011Port, w1: WinstonLoggerSource) => [a2, w1],
      inject: [Api3011Port, WinstonLoggerSource],
    },
  ],
  exports: [DATA_SOURCES, REACTIVE_DATA_SOURCES],
})
export class DataSourceModule {}

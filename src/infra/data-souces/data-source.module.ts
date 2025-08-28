import { Module } from '@nestjs/common';
import { Api3010Port } from './apis/api-3010-port';
import { Api3011Port } from './apis/api-3011-port';
import { WinstonLogger } from './files/winston-logger';

export const DATA_SOURCES = Symbol('DATA_SOURCES');
export const REACTIVE_DATA_SOURCES = Symbol('DATA_SOURCES');

@Module({
  providers: [
    Api3010Port,
    Api3011Port,
    WinstonLogger,
    {
      provide: DATA_SOURCES,
      useFactory: (a1: Api3010Port) => [a1],
      inject: [Api3010Port],
    },
    {
      provide: REACTIVE_DATA_SOURCES,
      useFactory: (a2: Api3011Port, w1: WinstonLogger) => [a2, w1],
      inject: [Api3011Port, WinstonLogger],
    },
  ],
  exports: [DATA_SOURCES, REACTIVE_DATA_SOURCES],
})
export class DataSourceModule {}

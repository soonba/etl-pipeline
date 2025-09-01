import { Module } from '@nestjs/common';
import { Api3011Port } from './apis/api-3011/api-3011-port';
import { WinstonLoggerSource } from './log-files/winston-logger-source';
import { ManagerModule } from './lock-manager/manager.module';

export const DATA_SOURCES = Symbol('DATA_SOURCES');

@Module({
  providers: [
    ManagerModule,
    Api3011Port,
    WinstonLoggerSource,
    {
      provide: DATA_SOURCES,
      useFactory: (a2: Api3011Port, w1: WinstonLoggerSource) => [a2, w1],
      inject: [Api3011Port, WinstonLoggerSource],
    },
  ],
  exports: [DATA_SOURCES],
})
export class DataSourceModule {}

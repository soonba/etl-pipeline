import { Module } from '@nestjs/common';
import { DataSourceModule } from './data-souces/data-source.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [DataSourceModule, LoggerModule],
  exports: [DataSourceModule, LoggerModule],
})
export class InfraModule {}

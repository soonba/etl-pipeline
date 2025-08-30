import { Module } from '@nestjs/common';
import { DataSourceModule } from './data-souces/data-source.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [DataSourceModule, DatabaseModule, LoggerModule],
  exports: [DataSourceModule, DatabaseModule, LoggerModule],
})
export class InfraModule {}

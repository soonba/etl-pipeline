import { Module } from '@nestjs/common';
import { DataSourceModule } from './data-souces/data-source.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DataSourceModule, DatabaseModule],
})
export class InfraModule {}

import { Module } from '@nestjs/common';
import { CollectDataJob } from './collect-data.job';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationModule } from '../application/application.module';
import { GetDataController } from './get-data.controller';
import { DomainModule } from '../domain/domain.module';

@Module({
  imports: [ApplicationModule, ScheduleModule.forRoot(), DomainModule],
  controllers: [GetDataController],
  providers: [CollectDataJob],
})
export class InterfaceModule {}

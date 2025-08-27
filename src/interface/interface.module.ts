import { Module } from '@nestjs/common';
import { CollectDataJob } from './collect-data.job';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule, ScheduleModule.forRoot()],
  providers: [CollectDataJob],
})
export class InterfaceModule {}

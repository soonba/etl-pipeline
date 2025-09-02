import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CollectDataUseCase } from '../application/collect-data.use-case';

@Injectable()
export class CollectDataJob {
  constructor(private readonly collectDataUseCase: CollectDataUseCase) {}

  @Cron('*/5 * * * * *')
  async run(): Promise<void> {
    console.log('trigger');
    return await this.collectDataUseCase.collect();
  }
}

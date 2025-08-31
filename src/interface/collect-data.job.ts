import { Injectable } from '@nestjs/common';
import { PipelineFacade } from '../application/pipeline-facade';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CollectDataJob {
  constructor(private readonly pipelineFacade: PipelineFacade) {}

  @Cron('*/5 * * * * *')
  async run(): Promise<void> {
    console.log('trigger');
    return await this.pipelineFacade.runPipeline();
  }
}

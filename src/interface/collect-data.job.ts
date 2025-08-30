import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PipelineFacade } from '../application/pipeline-facade';

@Injectable()
export class CollectDataJob {
  constructor(private readonly pipelineFacade: PipelineFacade) {}

  @Cron('*/10 * * * * *')
  async run(): Promise<void> {
    return await this.pipelineFacade.runPipeline();
  }
}

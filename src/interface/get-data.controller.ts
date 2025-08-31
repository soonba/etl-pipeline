import { Controller, Get, Inject } from '@nestjs/common';
import { DataRepository } from '../domain/repository/data.repository';
import { DATA_REPOSITORY } from '../domain/domain.module';
import { DataEntity } from 'src/domain/data.entity';

@Controller({
  version: '1',
  path: 'collect-data',
})
export class GetDataController {
  constructor(
    @Inject(DATA_REPOSITORY) private readonly dataRepository: DataRepository,
    // private readonly job: CollectDataJob,
  ) {}

  @Get()
  async get(): Promise<DataEntity[]> {
    return await this.dataRepository.findAll();
  }

  // @Get('/manual-trigger')
  // async manualTrigger(): Promise<string> {
  //   await this.job.run();
  //   return '1';
  // }
}

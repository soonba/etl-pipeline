import { Inject, Injectable } from '@nestjs/common';
import { CollectDataUseCase } from './collect-data.use-case';
import { DataRepository } from '../domain/repository/data.repository';
import { DATA_REPOSITORY } from '../domain/domain.module';

@Injectable()
export class PipelineFacade {
  constructor(
    private readonly collectUseCase: CollectDataUseCase,
    @Inject(DATA_REPOSITORY) private readonly dataRepository: DataRepository,
  ) {}

  async runPipeline(): Promise<void> {
    return await this.collectUseCase.collect();
  }
}

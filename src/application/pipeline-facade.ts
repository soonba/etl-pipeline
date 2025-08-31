import { Inject, Injectable } from '@nestjs/common';
import { CollectDataUseCase } from './collect-data.use-case';
import { DataRepository } from '../domain/repository/data.repository';
import { bufferCount } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DATA_REPOSITORY } from '../domain/domain.module';

@Injectable()
export class PipelineFacade {
  constructor(
    private readonly collectUseCase: CollectDataUseCase,
    @Inject(DATA_REPOSITORY) private readonly dataRepository: DataRepository,
  ) {}

  async runPipeline(): Promise<void> {
    //todo 파이프라인이 아직 종료되지 않았을 때 제어
    return new Promise((resolve, reject) => {
      this.collectUseCase
        .collect$()
        .pipe(
          bufferCount(100),
          mergeMap((bufferedRaw) => this.dataRepository.save(bufferedRaw)),
        )
        .subscribe({
          complete: () => resolve(),
          error: (err: Error) => reject(err),
        });
    });
  }
}

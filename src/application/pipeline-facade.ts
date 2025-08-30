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
    return new Promise((resolve, reject) => {
      this.collectUseCase
        .collect$()
        .pipe(
          bufferCount(100),
          mergeMap((bufferedRaw) => this.dataRepository.save(bufferedRaw)),
        )
        .subscribe({
          next: (data) => {
            console.log('적재성공', data);
          },
          error: (err: Error) => reject(err),
          complete: () => resolve(),
        });
    });
  }
}

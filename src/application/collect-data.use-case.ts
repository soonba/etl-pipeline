import { Inject, Injectable } from '@nestjs/common';
import { catchError, EMPTY, from, merge, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DataEntity } from '../domain/data.entity';
import { DATA_SOURCES, REACTIVE_DATA_SOURCES } from '../infra/data-souces/data-source.module';
import { DataSource } from '../infra/data-souces/data-source';
import { ReactiveDataSource } from '../infra/data-souces/reactive-data-source';
import { LOGGER } from '../infra/logger/logger.module';
import { BatchLogger } from '../infra/logger/batchLogger';

@Injectable()
export class CollectDataUseCase {
  constructor(
    @Inject(DATA_SOURCES) private readonly dataSources: DataSource[],
    @Inject(REACTIVE_DATA_SOURCES) private readonly reactiveDataSources: ReactiveDataSource[],
    @Inject(LOGGER) private readonly logger: BatchLogger,
  ) {}

  collect$(): Observable<DataEntity> {
    const promiseSources$ = this.dataSources.map((ds) =>
      from(ds.fetch()).pipe(
        mergeMap((entities) => from(entities)),
        catchError((error) => {
          this.logger.error('promise sources error', error);
          return EMPTY;
        }),
      ),
    );
    const reactiveSources$ = this.reactiveDataSources.map((ds) =>
      ds.fetch$().pipe(
        catchError((error) => {
          this.logger.error('reactive sources error', error);
          return EMPTY;
        }),
      ),
    );
    return merge(...promiseSources$, ...reactiveSources$);
  }
}

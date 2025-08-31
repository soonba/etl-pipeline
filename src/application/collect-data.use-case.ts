import { Inject, Injectable } from '@nestjs/common';
import { catchError, EMPTY, merge, Observable } from 'rxjs';
import { DataEntity } from '../domain/data.entity';
import { DATA_SOURCES } from '../infra/data-souces/data-source.module';
import { DataSource } from '../infra/data-souces/data-source';
import { LOGGER } from '../infra/logger/logger.module';
import { BatchLogger } from '../infra/logger/batch-logger';

@Injectable()
export class CollectDataUseCase {
  constructor(
    @Inject(DATA_SOURCES) private readonly dataSources: DataSource[],
    @Inject(LOGGER) private readonly logger: BatchLogger,
  ) {}

  collect$(): Observable<DataEntity> {
    const sources$ = this.dataSources.map((ds) =>
      ds.fetch$().pipe(
        catchError((error) => {
          this.logger.error('sources error', error);
          return EMPTY;
        }),
      ),
    );
    return merge(...sources$);
  }
}

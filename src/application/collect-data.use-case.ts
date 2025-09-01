import { Inject, Injectable } from '@nestjs/common';
import { bufferCount, catchError, EMPTY, lastValueFrom } from 'rxjs';
import { DATA_SOURCES } from '../infra/data-souces/data-source.module';
import { DataSource } from '../infra/data-souces/data-source';
import { LOGGER } from '../infra/logger/logger.module';
import { BatchLogger } from '../infra/logger/batch-logger';
import { mergeMap } from 'rxjs/operators';
import { DATA_REPOSITORY } from '../domain/domain.module';
import { DataRepository } from '../domain/repository/data.repository';
import { LAST_PATCHED_MANAGER, LOCK_MANAGER } from '../infra/data-souces/lock-manager/manager.module';
import { LockManager } from '../infra/data-souces/lock-manager/lock-manager';
import { LastPatchedManager } from '../infra/data-souces/lock-manager/last-patched-manager';

@Injectable()
export class CollectDataUseCase {
  constructor(
    @Inject(DATA_SOURCES) private readonly dataSources: DataSource[],
    @Inject(LOGGER) private readonly logger: BatchLogger,
    @Inject(DATA_REPOSITORY) private readonly dataRepository: DataRepository,
    @Inject(LOCK_MANAGER) private readonly lockManager: LockManager,
    @Inject(LAST_PATCHED_MANAGER) private readonly lastPatchedManager: LastPatchedManager,
  ) {}

  async collect(): Promise<void> {
    const process = this.dataSources.map(async (ds) => {
      const lock = await this.lockManager.acquire(ds.getKey());
      if (!lock) {
        this.logger.log(`skip datasource: ${ds.getKey()} (locked)`);
        return;
      }

      try {
        const lastPatched = await this.lastPatchedManager.get(ds.getKey());

        const result$ = ds.fetch$(lastPatched).pipe(
          bufferCount(100),
          mergeMap(async (raw) => {
            await this.dataRepository.save(raw);
            await this.lastPatchedManager.set(ds.getKey(), raw[raw.length - 1].currentPatched);
          }),
          catchError((error) => {
            this.logger.error(`source ${ds.getKey()} error`, error);
            return EMPTY;
          }),
        );
        await lastValueFrom(result$);
      } catch (err) {
        this.logger.error(`collect error for ${ds.getKey()}`, err);
      } finally {
        await this.lockManager.release(ds.getKey());
      }
    });
    await Promise.all(process);
  }
}

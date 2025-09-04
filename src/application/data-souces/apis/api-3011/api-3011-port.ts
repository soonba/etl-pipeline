import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataEntity } from '../../../../domain/data.entity';
import { DATA_REPOSITORY, LAST_PATCHED_MANAGER, LOCK_MANAGER, LOGGER } from '../../../../domain/domain.module';
import { DataRepository } from '../../../../domain/repository/data.repository';
import { LastPatchedManager } from '../../../../domain/repository/last-patched-manager';
import { LockManager } from '../../../../domain/repository/lock-manager';
import { BatchLogger } from '../../../../domain/logger/batch-logger';
import { DataSource } from '../../data-source';
import { delay } from '../../../../common/rate-limit.util';
import { Api3011Response } from './api-3011.response';
import { mapToEntity } from './map-to-entity';
import { Buffer } from '../../../../common/buffer';

@Injectable()
export class Api3011Port implements DataSource {
  constructor(
    @Inject(DATA_REPOSITORY) private readonly dataRepository: DataRepository,
    @Inject(LOCK_MANAGER) private readonly lockManager: LockManager,
    @Inject(LAST_PATCHED_MANAGER) private readonly lastPatchedManager: LastPatchedManager,
    @Inject(LOGGER) private readonly logger: BatchLogger,
  ) {}

  private readonly KEY = 'api-3011';
  private readonly BASE_URL = 'http://localhost:3011';
  private readonly RATE_LIMIT_DELAY = 1;

  async process() {
    const lock = await this.lockManager.acquire(this.KEY);
    if (!lock) {
      this.logger.log(`skip datasource: ${this.KEY} (locked)`);
      return;
    }
    const lastPage = await this.lastPatchedManager.get(this.KEY);
    const response = await this.fetchPage(lastPage);

    if (!response) {
      this.logger.log(`skip datasource: ${this.KEY} (api server not working)`);
      await this.lockManager.release(this.KEY);
      return;
    }

    const { maxPage } = response;
    const buffer = new Buffer<DataEntity>();
    for (let i = lastPage; i < maxPage; i++) {
      try {
        await delay(this.RATE_LIMIT_DELAY);
        const result = await this.fetchPage(i);
        if (!result) {
          throw Error();
        }
        const dataEntities = result.data.map((datum) => mapToEntity(this.KEY, datum));
        const pushed = buffer.push(dataEntities);
        if (pushed) {
          await this.dataRepository.save(pushed);
        }
      } catch (err) {
        this.logger.error(`collect error for ${this.KEY} page : ${i}`, err);
      }
    }

    await this.dataRepository.save(buffer.flush());
    await this.lastPatchedManager.set(this.KEY, maxPage);
    await this.lockManager.release(this.KEY);

    return;
  }

  private async fetchPage(page: number): Promise<Api3011Response | null> {
    try {
      return (await axios.get<Api3011Response>(this.BASE_URL, { params: { page } })).data;
    } catch {
      return null;
    }
  }
}

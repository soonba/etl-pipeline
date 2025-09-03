import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataEntity } from '../../../../domain/data.entity';
import { DATA_REPOSITORY, LAST_PATCHED_MANAGER, LOCK_MANAGER } from '../../../../domain/domain.module';
import { DataRepository } from '../../../../domain/repository/data.repository';
import { LastPatchedManager } from '../../../../domain/repository/last-patched-manager';
import { LockManager } from '../../../../domain/repository/lock-manager';
import { BatchLogger } from '../../../../infra/logger/batch-logger';
import { LOGGER } from '../../../../infra/logger/logger.module';
import { DataSource } from '../../data-source';
import { delay } from '../rate-limit.util';
import { Api3011Response } from './api-3011.response';
import { mapToEntity } from './map-to-entity';

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
  private readonly MAXIMUM_REQUEST_PER_SECOND = 1;

  async process() {
    const lock = await this.lockManager.acquire(this.KEY);
    if (!lock) {
      this.logger.log(`skip datasource: ${this.KEY} (locked)`);
      return;
    }
    let lastSaved = await this.lastPatchedManager.get(this.KEY);
    try {
      const lastPage = lastSaved;
      const { data: resData } = await axios.get<Api3011Response>(this.BASE_URL, { params: { page: lastPage } });
      const { maxPage } = resData;
      let buffer: DataEntity[] = [];
      for (let i = lastPage; i < maxPage; i++) {
        console.log(i + '번째 페이지로 돌아');
        await delay(this.MAXIMUM_REQUEST_PER_SECOND);
        const { data: resData } = await axios.get<Api3011Response>(this.BASE_URL, { params: { page: i } });
        buffer.push(...resData.data.map((datum) => mapToEntity(this.KEY, datum)));
        if (buffer.length >= 100) {
          await this.dataRepository.save(buffer);
          buffer = [];
        }
        lastSaved = i + 1;
      }
      await this.dataRepository.save(buffer);
    } catch (err) {
      this.logger.error(`collect error for ${this.KEY}`, err);
    } finally {
      await this.lastPatchedManager.set(this.KEY, lastSaved);
      await this.lockManager.release(this.KEY);
    }
    return;
  }
}

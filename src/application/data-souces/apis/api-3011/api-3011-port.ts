import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from '../../data-source';
import { DATA_REPOSITORY, LAST_PATCHED_MANAGER, LOCK_MANAGER } from '../../../../domain/domain.module';
import { DataRepository } from '../../../../domain/repository/data.repository';
import { LockManager } from '../../../../domain/repository/lock-manager';
import { LastPatchedManager } from '../../../../domain/repository/last-patched-manager';
import { LOGGER } from '../../../../infra/logger/logger.module';
import { BatchLogger } from '../../../../infra/logger/batch-logger';
import axios from 'axios';
import { Api3011Response } from './api-3011.response';
import { mapToEntity } from './map-to-entity';
import { delay } from '../rate-limit.util';
import { DataEntity } from '../../../../domain/data.entity';

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
      console.log('이번 대상', lastPage, ' ', maxPage);

      let buffer: DataEntity[] = [];
      for (let i = lastPage; i < maxPage; i++) {
        console.log('skip');
        await delay(this.MAXIMUM_REQUEST_PER_SECOND);
        const { data: resData } = await axios.get<Api3011Response>(this.BASE_URL, { params: { page: i } });
        buffer.push(...resData.data.map((datum) => mapToEntity(this.KEY, datum)));
        if (buffer.length >= 100) {
          await this.dataRepository.save(buffer);
          buffer = [];
        }
        lastSaved = i;
      }
      await this.dataRepository.save(buffer);
    } catch (err) {
      this.logger.error(`collect error for ${this.KEY}`, err);
    } finally {
      console.log('always finally' + lastSaved);
      await this.lastPatchedManager.set(this.KEY, lastSaved);
      await this.lockManager.release(this.KEY);
    }
    return;
  }
}

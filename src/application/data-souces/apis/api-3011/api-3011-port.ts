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
  private readonly RATE_LIMIT_DELAY = 1;
  private readonly BATCH_SIZE = 100;

  async process() {
    const lock = await this.lockManager.acquire(this.KEY);
    if (!lock) {
      this.logger.log(`skip datasource: ${this.KEY} (locked)`);
      return;
    }
    let lastSaved = await this.lastPatchedManager.get(this.KEY);
    const lastPage = lastSaved;
    const response = await this.fetchPage(lastPage);
    const { maxPage } = response;
    let buffer: DataEntity[] = [];
    for (let i = lastPage; i < maxPage; i++) {
      try {
        await delay(this.RATE_LIMIT_DELAY);
        const { data } = await this.fetchPage(i);
        buffer.push(...data.map((datum) => mapToEntity(this.KEY, datum)));
        const isLastLoop = i === maxPage - 1;
        if (buffer.length >= this.BATCH_SIZE || isLastLoop) {
          await this.dataRepository.save(buffer);
          buffer = [];
        }
        lastSaved = i + 1;
      } catch (err) {
        this.logger.error(`collect error for ${this.KEY} page : ${i}`, err);
      }
    }

    await this.lastPatchedManager.set(this.KEY, lastSaved);
    await this.lockManager.release(this.KEY);

    return;
  }

  private async fetchPage(page: number) {
    const { data } = await axios.get<Api3011Response>(this.BASE_URL, { params: { page } });
    return data;
  }
}

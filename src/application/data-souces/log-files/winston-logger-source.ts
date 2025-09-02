import * as fs from 'fs';
import * as path from 'node:path';
import { from, lastValueFrom, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import * as split2 from 'split2';
import { DataEntity } from '../../../domain/data.entity';
import { DataSource } from '../data-source';
import { mapToEntity } from './map-to-entity';
import { parseLogLine } from './parse-log-line';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_REPOSITORY, LAST_PATCHED_MANAGER, LOCK_MANAGER } from '../../../domain/domain.module';
import { DataRepository } from '../../../domain/repository/data.repository';
import { LockManager } from '../../../domain/repository/lock-manager';
import { LastPatchedManager } from '../../../domain/repository/last-patched-manager';
import { LOGGER } from '../../../infra/logger/logger.module';
import { BatchLogger } from '../../../infra/logger/batch-logger';

@Injectable()
export class WinstonLoggerSource implements DataSource {
  constructor(
    @Inject(DATA_REPOSITORY) private readonly dataRepository: DataRepository,
    @Inject(LOCK_MANAGER) private readonly lockManager: LockManager,
    @Inject(LAST_PATCHED_MANAGER) private readonly lastPatchedManager: LastPatchedManager,
    @Inject(LOGGER) private readonly logger: BatchLogger,
  ) {}

  private readonly KEY = 'winston';
  private readonly FILE_PATH = path.resolve(__dirname, '../../../../api-source/logs');

  async process(): Promise<void> {
    const lock = await this.lockManager.acquire(this.KEY);
    if (!lock) {
      this.logger.log(`skip datasource: ${this.KEY} (locked)`);
      return;
    }
    const files = fs.readdirSync(this.FILE_PATH).map((f) => path.join(this.FILE_PATH, f));

    await lastValueFrom(from(files).pipe(mergeMap((file) => this.readFile$(file), 5)));
    return;
  }

  private readFile$(file: string): Observable<DataEntity> {
    return new Observable<DataEntity>((subscriber) => {
      const readStream = fs.createReadStream(file).pipe(split2());

      readStream.on('data', (rawData: string) => {
        try {
          subscriber.next(mapToEntity(parseLogLine(rawData)));
        } catch (err) {
          subscriber.error(err);
        }
      });

      readStream.on('end', () => {
        fs.unlink(file, (err) => {
          if (err) {
            subscriber.error(err);
          } else {
            subscriber.complete();
          }
        });
      });

      readStream.on('error', (err) => {
        subscriber.error(err);
      });
    });
  }
}

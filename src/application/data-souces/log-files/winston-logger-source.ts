import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'node:path';
import { from, lastValueFrom, Observable } from 'rxjs';
import { bufferCount, mergeMap } from 'rxjs/operators';
import * as split2 from 'split2';
import { DataEntity } from '../../../domain/data.entity';
import { DATA_REPOSITORY, LOCK_MANAGER, LOGGER } from '../../../domain/domain.module';
import { DataRepository } from '../../../domain/repository/data.repository';
import { LockManager } from '../../../domain/repository/lock-manager';
import { BatchLogger } from '../../../domain/logger/batch-logger';
import { DataSource } from '../data-source';
import { mapToEntity } from './map-to-entity';
import { parseLogLine } from './parse-log-line';

@Injectable()
export class WinstonLoggerSource implements DataSource {
  constructor(
    @Inject(DATA_REPOSITORY) private readonly dataRepository: DataRepository,
    @Inject(LOCK_MANAGER) private readonly lockManager: LockManager,
    @Inject(LOGGER) private readonly logger: BatchLogger,
  ) {}

  private readonly KEY = 'winston';
  private readonly FILE_PATH = path.resolve(__dirname, '../../../../data-source/logs');

  async process(): Promise<void> {
    const lock = await this.lockManager.acquire(this.KEY);
    if (!lock) {
      this.logger.log(`skip datasource: ${this.KEY} (locked)`);
      return;
    }
    const files = fs.readdirSync(this.FILE_PATH).map((f) => path.join(this.FILE_PATH, f));
    if (files.length > 0) {
      await lastValueFrom(
        from(files).pipe(
          mergeMap((file) => this.doProcess$(file), 5),
          bufferCount(100),
          mergeMap(async (raw) => await this.dataRepository.save(raw)),
        ),
      );
    }
    await this.lockManager.release(this.KEY);
    return;
  }

  private doProcess$(file: string): Observable<DataEntity> {
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

import { DataEntity } from '../../../domain/data.entity';
import { ReactiveDataSource } from '../reactive-data-source';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as path from 'node:path';
import * as split2 from 'split2';
import { parseLogLine } from './parse-log-line';
import { mapToEntity } from './map-to-entity';

export class WinstonLoggerSource implements ReactiveDataSource {
  //todo: 확장시 별도 db로 분리
  private lastOffset = 0;

  fetch$(): Observable<DataEntity> {
    const file = path.resolve(__dirname, '../../../../api-source/winston.log');
    const stats = fs.statSync(file);
    const start = this.lastOffset;
    const end = stats.size;
    this.lastOffset = end;

    const readStream = fs.createReadStream(file, { start, end }).pipe(split2());

    return new Observable<DataEntity>((subscriber) => {
      readStream.on('data', (rawData: string) => {
        try {
          subscriber.next(mapToEntity(parseLogLine(rawData)));
        } catch (err) {
          subscriber.error(err);
        }
      });

      readStream.on('end', () => {
        subscriber.complete();
      });

      readStream.on('error', (err) => {
        subscriber.error(err);
      });
    });
  }
}

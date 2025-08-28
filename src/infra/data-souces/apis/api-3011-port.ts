import { ReactiveDataSource } from '../reactive-data-source';
import { Observable } from 'rxjs';
import { DataEntity } from '../../../domain/data.entity';

export class Api3011Port implements ReactiveDataSource {
  fetch$(): Observable<DataEntity> {
    throw new Error('Method not implemented.');
  }
}

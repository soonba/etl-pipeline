import { Observable } from 'rxjs';
import { DataEntity } from '../../domain/data.entity';

export interface ReactiveDataSource {
  fetch$(): Observable<DataEntity>;
}

import { Observable } from 'rxjs';
import { DataEntity } from '../../domain/data.entity';

export interface DataSource {
  fetch$(): Observable<DataEntity>;
}

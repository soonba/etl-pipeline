import { DataEntity } from '../../domain/data.entity';
import { Observable } from 'rxjs';

export interface DataSource {
  fetch$(lastPatched?: number): Observable<DataEntity>;
  getKey(): string;
}

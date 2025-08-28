import { DataEntity } from '../../domain/data.entity';

export interface DataSource {
  fetch(): Promise<DataEntity[]>;
}

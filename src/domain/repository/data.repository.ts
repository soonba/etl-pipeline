import { DataEntity } from '../data.entity';

export interface DataRepository {
  save(data: DataEntity | DataEntity[]): Promise<void>;
}

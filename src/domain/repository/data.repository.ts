import { DataEntity } from '../data.entity';

export interface DataRepository {
  save(data: DataEntity[]): Promise<void>;
  findAll(): Promise<DataEntity[]>;
}

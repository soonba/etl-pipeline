import { DataRepository } from '../../domain/repository/data.repository';
import { DataEntity } from '../../domain/data.entity';

export class InMemoryDatabase implements DataRepository {
  private readonly dataDb = [] as DataEntity[];

  save(data: DataEntity | DataEntity[]): Promise<void> {
    if (Array.isArray(data)) {
      this.dataDb.push(...data);
    } else {
      this.dataDb.push(data);
      console.log(`source ${data.key} inserted`);
    }
    return Promise.resolve();
  }

  findAll(): Promise<DataEntity[]> {
    return Promise.resolve(this.dataDb);
  }
}

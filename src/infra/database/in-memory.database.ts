import { DataEntity } from '../../domain/data.entity';
import { DataRepository } from '../../domain/repository/data.repository';

export class InMemoryDatabase implements DataRepository {
  private readonly dataDb = [] as DataEntity[];

  async save(data: DataEntity[]): Promise<void> {
    if (data.length > 0) {
      this.dataDb.push(...data);
      console.log(`source ${data[0]?.key} length ${data.length} inserted`);
    }
    return;
  }

  async findAll(): Promise<DataEntity[]> {
    return this.dataDb;
  }
}

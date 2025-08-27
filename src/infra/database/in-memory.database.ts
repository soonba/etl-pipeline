import { DataRepository } from '../../domain/repository/data.repository';

export class InMemoryDatabase implements DataRepository<any> {
  private readonly db = [] as any[];
  async save(data: any): Promise<void> {
    this.db.push(data);
    return;
  }
}

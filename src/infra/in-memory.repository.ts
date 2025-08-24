import { DataRepository } from '../domain/repository/data.repository';

export class InMemoryRepository implements DataRepository<any> {
  load(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
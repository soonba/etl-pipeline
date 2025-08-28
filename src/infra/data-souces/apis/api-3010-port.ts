import { DataSource } from '../data-source';
import { DataEntity } from '../../../domain/data.entity';

export class Api3010Port implements DataSource {
  fetch(): Promise<DataEntity[]> {
    throw new Error('Method not implemented.');
  }
}

import { DataSource } from '../data-source';

export class WinstonLogger implements DataSource {
  fetch(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

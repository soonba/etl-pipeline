import { DataSource } from '../data-source';

export class Api3011Port implements DataSource {
  fetch(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

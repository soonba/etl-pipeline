import { DataSource } from '../data-source';

export class Api3010Port implements DataSource {
  fetch(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

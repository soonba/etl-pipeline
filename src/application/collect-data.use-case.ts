import { Inject, Injectable } from '@nestjs/common';
import { DATA_SOURCES } from './data-souces/data-source.module';
import { DataSource } from './data-souces/data-source';

@Injectable()
export class CollectDataUseCase {
  constructor(@Inject(DATA_SOURCES) private readonly dataSources: DataSource[]) {}

  async collect(): Promise<void> {
    const process = this.dataSources.map((ds) => ds.process());
    await Promise.all(process);
  }
}

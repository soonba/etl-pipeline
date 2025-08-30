import { Module } from '@nestjs/common';
import { InMemoryDatabase } from '../infra/database/in-memory.database';

export const DATA_REPOSITORY = Symbol('data-repository');

@Module({
  providers: [
    {
      provide: DATA_REPOSITORY,
      useClass: InMemoryDatabase,
    },
  ],
  exports: [DATA_REPOSITORY],
})
export class DomainModule {}

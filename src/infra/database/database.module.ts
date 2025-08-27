import { Module } from '@nestjs/common';
import { InMemoryDatabase } from './in-memory.database';

@Module({
  providers: [InMemoryDatabase],
})
export class DatabaseModule {}

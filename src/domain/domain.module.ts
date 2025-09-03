import { Module } from '@nestjs/common';
import { InMemoryDatabase } from '../infra/database/in-memory.database';
import { InMemoryLockManager } from '../infra/lock-manager/in-memory.lock-manager';
import { InMemoryLastPatchedManager } from '../infra/lock-manager/in-memory.last-patched-manager';

export const DATA_REPOSITORY = Symbol('data-repository');
export const LOCK_MANAGER = Symbol('LOCK_MANAGER');
export const LAST_PATCHED_MANAGER = Symbol('LAST_PATCHED_MANAGER');

@Module({
  providers: [
    {
      provide: DATA_REPOSITORY,
      useClass: InMemoryDatabase,
    },
    {
      provide: LOCK_MANAGER,
      useClass: InMemoryLockManager,
    },
    {
      provide: LAST_PATCHED_MANAGER,
      useClass: InMemoryLastPatchedManager,
    },
  ],
  exports: [DATA_REPOSITORY, LOCK_MANAGER, LAST_PATCHED_MANAGER],
})
export class DomainModule {}

import { Module } from '@nestjs/common';
import { InMemoryLockManager } from './in-memory.lock-manager';
import { InMemoryLastPatchedManager } from './in-memory.last-patched-manager';

export const LOCK_MANAGER = Symbol('LOCK_MANAGER');
export const LAST_PATCHED_MANAGER = Symbol('LAST_PATCHED_MANAGER');

@Module({
  providers: [
    {
      provide: LOCK_MANAGER,
      useClass: InMemoryLockManager,
    },
    {
      provide: LAST_PATCHED_MANAGER,
      useClass: InMemoryLastPatchedManager,
    },
  ],
  exports: [LOCK_MANAGER, LAST_PATCHED_MANAGER],
})
export class ManagerModule {}

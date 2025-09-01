import { LockManager } from './lock-manager';

export class InMemoryLockManager implements LockManager {
  acquire(key: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  release(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

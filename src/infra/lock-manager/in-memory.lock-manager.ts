import { LockManager } from '../../domain/repository/lock-manager';

export class InMemoryLockManager implements LockManager {
  manager = new Map<string, boolean>();
  async acquire(key: string): Promise<boolean> {
    if (this.manager.get(key)) {
      return false;
    }
    console.log('그럼여긴디');
    this.manager.set(key, true);
    return true;
  }
  async release(key: string): Promise<void> {
    this.manager.set(key, false);
    console.log('풀어', this.manager.get(key));
    return;
  }
}

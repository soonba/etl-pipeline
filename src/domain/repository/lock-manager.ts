export interface LockManager {
  acquire(key: string): Promise<boolean>;
  release(key: string): Promise<void>;
}

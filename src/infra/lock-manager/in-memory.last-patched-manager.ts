import { LastPatchedManager } from '../../domain/repository/last-patched-manager';

export class InMemoryLastPatchedManager implements LastPatchedManager {
  manager = new Map<string, number>();
  async get(key: string): Promise<number> {
    return this.manager.get(key) ?? 1;
  }
  async set(key: string, pageOrLines: number): Promise<void> {
    this.manager.set(key, pageOrLines);
    return;
  }
}

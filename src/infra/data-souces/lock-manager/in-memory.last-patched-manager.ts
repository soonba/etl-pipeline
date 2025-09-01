import { LastPatchedManager } from './last-patched-manager';

export class InMemoryLastPatchedManager implements LastPatchedManager {
  get(key: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  set(key: string, pageOrLines: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
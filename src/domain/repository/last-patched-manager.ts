export interface LastPatchedManager {
  get(key: string): Promise<number>;
  set(key: string, pageOrLines: number): Promise<void>;
}

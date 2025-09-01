export interface LastPatchedManager {
  get(key: string): Promise<number> | undefined;
  set(key: string, pageOrLines: number): Promise<void>;
}

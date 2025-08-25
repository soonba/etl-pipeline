export interface DataRepository<T> {
  load(data: T | T[]): Promise<void>;
}
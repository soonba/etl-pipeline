export interface DataSource {
  process(): Promise<void>;
}

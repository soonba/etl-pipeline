export interface DataSource {
  fetch(): Promise<void>;
}

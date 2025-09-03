export class Buffer<T> {
  private data: T[] = [];
  constructor(private readonly capacity: number = 100) {}

  push(_data: T[]): T[] | null {
    this.data.push(..._data);
    if (this.capacity && this.data.length >= this.capacity) {
      return this.flush();
    }
    return null;
  }

  flush(): T[] {
    const emitData = [...this.data];
    this.data = [];
    return emitData;
  }
}

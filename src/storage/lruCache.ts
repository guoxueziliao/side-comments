export class LruCache<K, V> {
  private readonly items = new Map<K, V>();

  constructor(private maxSize: number) {}

  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;
    this.prune();
  }

  get(key: K): V | undefined {
    if (!this.items.has(key)) {
      return undefined;
    }

    const value = this.items.get(key);
    this.items.delete(key);
    this.items.set(key, value as V);
    return value;
  }

  set(key: K, value: V): void {
    if (this.items.has(key)) {
      this.items.delete(key);
    }
    this.items.set(key, value);
    this.prune();
  }

  delete(key: K): void {
    this.items.delete(key);
  }

  private prune(): void {
    while (this.items.size > this.maxSize) {
      const oldest = this.items.keys().next().value;
      if (oldest === undefined) {
        return;
      }
      this.items.delete(oldest);
    }
  }
}

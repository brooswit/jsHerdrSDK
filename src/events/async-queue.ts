/** Push-in, async-iterate-out. Pure; no I/O. */
export class AsyncQueue<T> implements AsyncIterable<T> {
  private items: T[] = [];
  private waiters: Array<(r: IteratorResult<T>) => void> = [];
  private failers: Array<(e: unknown) => void> = [];
  private done = false;
  private error: unknown;

  push(item: T): void {
    if (this.done) return;
    const w = this.waiters.shift();
    if (w) { this.failers.shift(); w({ value: item, done: false }); } else this.items.push(item);
  }
  end(): void { this.done = true; for (const w of this.waiters.splice(0)) w({ value: undefined as never, done: true }); this.failers.length = 0; }
  fail(e: unknown): void { this.error = e; this.done = true; for (const f of this.failers.splice(0)) f(e); this.waiters.length = 0; }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return {
      next: () => {
        if (this.items.length) return Promise.resolve({ value: this.items.shift()!, done: false });
        if (this.error) return Promise.reject(this.error);
        if (this.done) return Promise.resolve({ value: undefined as never, done: true });
        return new Promise((res, rej) => { this.waiters.push(res); this.failers.push(rej); });
      },
      return: () => { this.end(); return Promise.resolve({ value: undefined as never, done: true }); },
    };
  }
}

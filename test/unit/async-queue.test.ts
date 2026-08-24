import { describe, expect, test } from "bun:test";
import { AsyncQueue } from "../../src/events/async-queue.js";

describe("AsyncQueue", () => {
  test("delivers pushed-before-awaited and awaited-before-pushed", async () => {
    const q = new AsyncQueue<number>();
    q.push(1);
    const it = q[Symbol.asyncIterator]();
    expect(await it.next()).toEqual({ value: 1, done: false });
    const p = it.next();
    q.push(2);
    expect(await p).toEqual({ value: 2, done: false });
  });
  test("end() completes waiters; fail() rejects them", async () => {
    const q = new AsyncQueue<number>(); const it = q[Symbol.asyncIterator]();
    const p = it.next(); q.end(); expect((await p).done).toBe(true);
    const q2 = new AsyncQueue<number>(); const it2 = q2[Symbol.asyncIterator]();
    const p2 = it2.next(); q2.fail(new Error("boom")); await expect(p2).rejects.toThrow("boom");
  });
});

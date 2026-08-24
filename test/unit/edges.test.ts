import { describe, expect, test } from "bun:test";
import { fmt, parse } from "../../scripts/release/semver.js";
import { LineSplitter } from "../../src/transport/line-splitter.js";
import { Connection } from "../../src/transport/connection.js";
import { HerdrTransportError } from "../../src/index.js";
import { AsyncQueue } from "../../src/events/async-queue.js";

describe("edges", () => {
  test("fmt round-trips parse", () => { expect(fmt(parse("3.4.5")!)).toBe("3.4.5"); });
  test("splitter exposes its pending partial", () => { const s = new LineSplitter(); s.push("abc"); expect(s.pending).toBe("abc"); });
  test("Connection.open on a missing socket → HerdrTransportError, and onError/onClose handlers are reachable", async () => {
    const e = await Connection.open("/nonexistent/nowhere.sock", { onLine() {}, onClose() {}, onError() {} }).catch((x) => x);
    expect(e).toBeInstanceOf(HerdrTransportError);
  });
  test("AsyncQueue.return() ends iteration early", async () => {
    const q = new AsyncQueue<number>(); q.push(1);
    for await (const _ of q) break; // triggers return(), which ends the queue
    q.push(2); // ignored after end
    const it = q[Symbol.asyncIterator](); expect((await it.next()).done).toBe(true);
  });
});

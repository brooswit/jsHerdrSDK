import { Connection } from "../transport/connection.js";
import { HerdrError, HerdrTransportError } from "../protocol/error.js";
import { isErrorEnvelope, type ResponseEnvelope } from "../protocol/envelope.js";
import { nextId } from "../protocol/id.js";
import type { Subscription as SubscriptionSpec } from "../generated/params.js";
import type { PushFrame } from "../generated/events.js";
import { AsyncQueue } from "./async-queue.js";

/**
 * `events.subscribe` on a connection the server keeps open. After the
 * `subscription_started` ack every further line is a push frame.
 *
 * Consumed as an async iterator; `close()` ends it.
 */
export class Subscription implements AsyncIterable<PushFrame> {
  private constructor(private readonly conn: Connection, private readonly queue: AsyncQueue<PushFrame>) {}

  static async open(socketPath: string, subscriptions: SubscriptionSpec[]): Promise<Subscription> {
    const id = nextId("sub");
    const queue = new AsyncQueue<PushFrame>();
    let acked = false;
    let ackResolve!: () => void, ackReject!: (e: unknown) => void;
    const ack = new Promise<void>((r, j) => { ackResolve = r; ackReject = j; });

    const conn = await Connection.open(socketPath, {
      onLine(line) {
        let msg: any;
        try { msg = JSON.parse(line); } catch { return; }
        if (!acked) {
          const env = msg as ResponseEnvelope<unknown>;
          if (env.id !== id && env.id !== "") return;
          acked = true;
          return isErrorEnvelope(env) ? ackReject(HerdrError.from("events.subscribe", env.error)) : ackResolve();
        }
        if ("event" in msg && "data" in msg) queue.push(msg as PushFrame);
      },
      onClose() { acked ? queue.end() : ackReject(new HerdrTransportError("events.subscribe: closed before ack")); },
      onError(e) { acked ? queue.fail(e) : ackReject(new HerdrTransportError("events.subscribe: socket error", e)); },
    });
    conn.writeLine(JSON.stringify({ id, method: "events.subscribe", params: { subscriptions } }));
    await ack;
    return new Subscription(conn, queue);
  }

  [Symbol.asyncIterator](): AsyncIterator<PushFrame> { return this.queue[Symbol.asyncIterator](); }
  close(): void { this.conn.close(); this.queue.end(); }
}

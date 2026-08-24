import { tmpdir } from "node:os";
import { join } from "node:path";
import { LineSplitter } from "../../src/transport/line-splitter.js";

type Handler = (params: any, id: string) => { result: any } | { error: { code: string; message: string } } | "close" | "garbage" | "wrong-id" | "stream" | "silent";

/**
 * In-process herdr stand-in. Mirrors the measured wire behaviour:
 * one request → one response → close; `events.subscribe` acks then streams.
 * `on(method, handler)` scripts a reply, including the failure shapes a real
 * herdr never produces, which is the point of having a fake.
 */
export class FakeHerdr {
  readonly path = join(tmpdir(), `fake-herdr-${process.pid}-${Math.random().toString(36).slice(2)}.sock`);
  private handlers = new Map<string, Handler>();
  private server: ReturnType<typeof Bun.listen> | undefined;
  readonly seen: Array<{ method: string; params: any }> = [];
  /** frames to push after a subscribe ack */
  streamFrames: any[] = [];

  on(method: string, h: Handler): this { this.handlers.set(method, h); return this; }

  async start(): Promise<this> {
    const self = this;
    this.server = Bun.listen({
      unix: this.path,
      socket: {
        open() {},
        data(sock, chunk) {
          const split = (sock as any).__split ??= new LineSplitter();
          for (const line of split.push(chunk.toString())) {
            let req: any;
            try { req = JSON.parse(line); } catch { sock.write(JSON.stringify({ id: "", error: { code: "invalid_request", message: "bad json" } }) + "\n"); sock.end(); return; }
            self.seen.push({ method: req.method, params: req.params });
            const h = self.handlers.get(req.method);
            const out = h ? h(req.params, req.id) : { error: { code: "unknown_method", message: `no handler for ${req.method}` } };
            if (out === "silent") return; // never answers, never closes
            if (out === "close") { sock.end(); return; }
            if (out === "garbage") { sock.write("this is not json\n"); sock.end(); return; }
            if (out === "wrong-id") { sock.write(JSON.stringify({ id: "someone-else", result: { type: "pong" } }) + "\n"); sock.end(); return; }
            if (out === "stream") {
              sock.write(JSON.stringify({ id: req.id, result: { type: "subscription_started" } }) + "\n");
              for (const f of self.streamFrames) sock.write(JSON.stringify(f) + "\n");
              return; // stays open until client closes
            }
            sock.write(JSON.stringify({ id: req.id, ...out }) + "\n");
            sock.end();
          }
        },
      },
    });
    return this;
  }
  stop(): void { this.server?.stop(true); }
}

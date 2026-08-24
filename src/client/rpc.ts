import { Connection } from "../transport/connection.js";
import { HerdrError, HerdrTransportError } from "../protocol/error.js";
import { isErrorEnvelope, type ResponseEnvelope } from "../protocol/envelope.js";
import { nextId } from "../protocol/id.js";
import type { Method } from "../generated/params.js";
import type { ParamsOf, ResultOf } from "./typed.js";

export interface RpcOptions {
  socketPath: string;
  /** Client-side guard; the server has its own per-method timeouts and reports them as `code:"timeout"`. */
  timeoutMs?: number;
}

/**
 * One request → one response → the server closes.
 *
 * herdr 0.8.2 closes the connection after every response (measured), so there
 * is no multiplexing here by design: each call opens its own connection.
 */
export async function rpc<M extends Method>(opts: RpcOptions, method: M, params: ParamsOf<M>): Promise<ResultOf<M>> {
  const id = nextId();
  return new Promise<ResultOf<M>>(async (resolve, reject) => {
    let settled = false;
    const settle = (fn: () => void) => { if (!settled) { settled = true; clearTimeout(timer); fn(); } };
    const timer = opts.timeoutMs
      ? setTimeout(() => settle(() => { conn?.close(); reject(new HerdrTransportError(`${method}: no response within ${opts.timeoutMs}ms`)); }), opts.timeoutMs)
      : undefined;

    let conn: Connection | undefined;
    try {
      conn = await Connection.open(opts.socketPath, {
        onLine(line) {
          let env: ResponseEnvelope<unknown>;
          try { env = JSON.parse(line); } catch (e) { return settle(() => reject(new HerdrTransportError(`${method}: unparseable response`, e))); }
          if (env.id !== id && env.id !== "") return; // not ours (id "" = server could not parse our request; still report it)
          settle(() => (isErrorEnvelope(env) ? reject(HerdrError.from(method, env.error)) : resolve(env.result as ResultOf<M>)));
        },
        onClose() { settle(() => reject(new HerdrTransportError(`${method}: connection closed before a response`))); },
        onError(e) { settle(() => reject(new HerdrTransportError(`${method}: socket error`, e))); },
      });
      conn.writeLine(JSON.stringify({ id, method, params }));
    } catch (e) {
      settle(() => reject(e));
    }
  });
}

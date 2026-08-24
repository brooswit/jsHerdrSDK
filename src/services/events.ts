import { Service } from "./base.js";
import type { params } from "../generated/index.js";

/** RPC-shaped event helpers. For the streaming form use `HerdrClient.subscribe`. */
export class EventsService extends Service {
  /** Block until one matching event; timeout is a `HerdrError` code `timeout`. */
  wait(p: params.EventsWaitParams) { return this.call("events.wait", p); }
  /** Raw one-shot subscribe (returns only the ack). Prefer `HerdrClient.subscribe`. */
  subscribeAck(p: params.EventsSubscribeParams) { return this.call("events.subscribe", p); }
}

export { HerdrClient, type HerdrClientOptions } from "./herdr-client.js";
export { HerdrError, HerdrTransportError, isTimeout } from "./protocol/error.js";
export { Subscription } from "./events/subscription.js";
export { defaultSocketPath } from "./transport/socket-path.js";
export * from "./reducers/index.js";
export * from "./services/index.js";
export * from "./generated/index.js";
export type { ParamsOf, ResultOf } from "./client/typed.js";

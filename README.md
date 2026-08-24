# @brooswit/herdr-sdk

Typed TypeScript client for the [herdr](https://herdr.dev) socket API, generated from the schema herdr itself publishes (`herdr api schema --json`).

```ts
import { HerdrClient } from "@brooswit/herdr-sdk";

const h = new HerdrClient();                       // ~/.config/herdr/herdr.sock, or $HERDR_SOCKET
const { snapshot } = await h.session.snapshot();  // fully typed
await h.agent.wait({ target: "w1:p3", until: ["idle"], timeout_ms: 30_000 });

const sub = await h.subscribe([{ type: "pane.agent_status_changed", pane_id: "w1:p3" }]);
for await (const frame of sub) console.log(frame.event, frame.data);
```

## Layers

| dir | job |
|---|---|
| `src/transport` | unix socket ↔ newline-delimited frames. No JSON, no protocol. |
| `src/protocol` | envelope shapes, `HerdrError`, ids. No I/O. |
| `src/client` | one request → one response → server closes (that is herdr's wire behaviour). |
| `src/events` | `events.subscribe`: the one long-lived connection, as an async iterator. |
| `src/services` | one file per method family; thin typed façades. |
| `src/reducers` | pure: snapshot + push frames → current fleet state. |
| `src/generated` | codegen output. **Do not edit**; run `bun run generate`. |
| `scripts/gen` | the generator, one file per output. |

## Wire facts this is built on (herdr 0.8.2, protocol 20)

- Request `{id, method, params}` → `{id, result:{type,…}}` or `{id, error:{code,message}}`.
- The server **closes after one response**. Each RPC is its own connection.
- `events.subscribe` acks `subscription_started` and then keeps the connection open, streaming `{event, data}` frames.
- Timeouts are typed errors (`code: "timeout"`), never hangs. `isTimeout(e)`.
- The schema does not say which result each method returns; `scripts/gen/method-result-map.ts` does, and `test/live` proves it.

## Scripts

```
bun run generate     # schema → src/generated
bun run check        # generate + drift guard + typecheck + unit  (what CI runs)
bun run build
HERDR_LIVE=1 bun test test/live   # against your running herdr
```

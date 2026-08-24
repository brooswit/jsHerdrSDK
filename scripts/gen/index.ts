import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUT_DIR, header, loadSchema } from "./schema.js";
import { emitParams } from "./emit-params.js";
import { emitResults } from "./emit-results.js";
import { emitErrors } from "./emit-errors.js";
import { emitEvents } from "./emit-events.js";

const schema = await loadSchema();
const h = header(schema);
mkdirSync(OUT_DIR, { recursive: true });

const files: Record<string, string> = {
  "params.ts": emitParams(schema, h),
  "results.ts": emitResults(schema, h),
  "errors.ts": emitErrors(schema, h),
  "events.ts": emitEvents(schema, h),
  "index.ts": `${h}
// Each schema namespace is its own module: 12 type names (PaneInfo, TabInfo,
// WorkspaceInfo, ...) are defined DIFFERENTLY in the event and response
// namespaces, so a flat merge would be wrong, not just ambiguous.
export * as params from "./params.js";
export * as results from "./results.js";
export * as errors from "./errors.js";
export * as events from "./events.js";
// The handful of names everything needs, re-exported flat for convenience.
export type { Method, MethodParams, Subscription } from "./params.js";
export { METHODS } from "./params.js";
export type { ResponseResult, ResultByTag, ResultTag } from "./results.js";
export { METHOD_RESULT } from "./results.js";
export type { ErrorBody } from "./errors.js";
export type { EventFrame, SubscriptionEventFrame, PushFrame, AgentStatus, EventKind, SubscriptionEventKind } from "./events.js";
export const PROTOCOL = ${JSON.stringify(schema.protocol)} as const;
export const SCHEMA_VERSION = ${JSON.stringify(schema.schema_version)} as const;
`,
};
for (const [name, body] of Object.entries(files)) writeFileSync(join(OUT_DIR, name), body);
console.log(`generated ${Object.keys(files).length} files → src/generated`);

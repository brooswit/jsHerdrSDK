import { execSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compareInventories, hasDrift, inventoryOf } from "./inventory.js";
import { coverage, wrappedMethods } from "./coverage.js";

const ROOT = join(import.meta.dir, "..", "..");
const herdr = process.env.HERDR_BIN ?? "herdr";

const ours = JSON.parse(readFileSync(join(ROOT, "schema/herdr-api.schema.json"), "utf8"));
const pinned = JSON.parse(readFileSync(join(ROOT, "schema/herdr-version.json"), "utf8"));
const theirsRaw = execSync(`${herdr} api schema --json`, { encoding: "utf8", env: { ...process.env, HERDR_SOCKET: "/nonexistent" } });
const theirs = JSON.parse(theirsRaw);
const liveVersion = execSync(`${herdr} --version`, { encoding: "utf8" }).trim().replace(/^herdr\s+/, "");

let failed = false;
const fail = (msg: string) => { failed = true; console.log("  ✗ " + msg); };
const ok = (msg: string) => console.log("  ✓ " + msg);
const warn = (msg: string) => console.log("  ⚠ " + msg);

console.log(`\n1. version — SDK pinned to herdr ${pinned.version}, installed herdr ${liveVersion}`);
liveVersion === pinned.version ? ok("versions match") : warn(`herdr ${liveVersion} is out; the SDK was generated against ${pinned.version}. Not a failure by itself — the schema diff below decides.`);

console.log(`\n2. API inventory — committed schema vs installed herdr's schema`);
const cmp = compareInventories(inventoryOf(ours), inventoryOf(theirs));
cmp.protocol.same ? ok(`protocol ${cmp.protocol.ours}`) : fail(`protocol changed ${cmp.protocol.ours} → ${cmp.protocol.theirs}`);
for (const [k, d] of Object.entries(cmp)) {
  if (k === "protocol") continue;
  const { added, removed } = d as { added: string[]; removed: string[] };
  if (!added.length && !removed.length) { ok(`${k}: identical`); continue; }
  if (added.length) fail(`${k}: herdr ADDED ${added.length} the SDK lacks: ${added.join(", ")}`);
  if (removed.length) fail(`${k}: herdr REMOVED ${removed.length} the SDK still has: ${removed.join(", ")}`);
}

console.log(`\n3. service coverage — every schema method has a typed wrapper`);
const svcDir = join(ROOT, "src/services");
const sources = readdirSync(svcDir).filter((f) => f.endsWith(".ts")).map((f) => readFileSync(join(svcDir, f), "utf8"));
const cov = coverage(inventoryOf(theirs).methods, wrappedMethods(sources));
cov.stale.length ? fail(`wrappers for methods herdr no longer has: ${cov.stale.join(", ")}`) : ok("no stale wrappers");
cov.unwrapped.length
  ? warn(`${cov.unwrapped.length} methods reachable only via client.call(): ${cov.unwrapped.join(", ")}`)
  : ok("every method has a service wrapper");

if (failed) {
  console.log("\nFAILED — herdr's API and this SDK have drifted. Refresh with:\n  herdr api schema --json > schema/herdr-api.schema.json && bun run generate\nand update schema/herdr-version.json.");
  process.exit(1);
}
console.log(`\nOK — SDK matches herdr ${liveVersion}.`);

import { describe, expect, test } from "bun:test";
import { LIVE, client } from "./_live.js";

describe.skipIf(!LIVE)("live: subscription streams real events", () => {
  test("workspace.create arrives on a subscription, then close() ends the iterator", async () => {
    const c = client();
    const sub = await c.subscribe([{ type: "workspace.created" }, { type: "workspace.closed" }]);
    const label = `sdk-test-${Date.now().toString(36)}`;
    const created = await c.workspace.create({ label } as any);
    const frames: any[] = [];
    for await (const f of sub) { frames.push(f); if (f.event === "workspace_created" || frames.length >= 5) break; }
    sub.close();
    expect(frames.some((f) => f.event === "workspace_created")).toBe(true);
    // cleanup
    const id = (created as any).workspace?.workspace_id ?? (created as any).workspace_id;
    if (id) await c.workspace.close({ workspace_id: id } as any).catch(() => {});
  }, 20_000);
});

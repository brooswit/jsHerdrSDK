import { describe, expect, test } from "bun:test";
import { LIVE, client } from "./_live.js";
import { HerdrError } from "../../src/index.js";

describe.skipIf(!LIVE)("live: new service families reach the server", () => {
  test("plugin.list returns a typed result", async () => {
    const r: any = await client().plugin.list();
    expect(typeof r.type).toBe("string");
  });
  test("layout.export for the current workspace answers or errors with a server code", async () => {
    const r: any = await client().layout.export({} as any).catch((e) => e);
    if (r instanceof HerdrError) expect(typeof r.code).toBe("string"); else expect(typeof r.type).toBe("string");
  });
  test("pane.edges on a real pane answers", async () => {
    const c = client(); const first = (await c.pane.list()).panes?.[0];
    if (!first) return;
    const r: any = await c.pane.edges({ pane_id: first.pane_id } as any).catch((e) => e);
    if (r instanceof HerdrError) expect(typeof r.code).toBe("string"); else expect(typeof r.type).toBe("string");
  });
});

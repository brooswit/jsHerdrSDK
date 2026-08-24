import { describe, expect, test } from "bun:test";
import { LIVE, client } from "./_live.js";
import { HerdrError, HerdrTransportError, isTimeout } from "../../src/index.js";

describe.skipIf(!LIVE)("live: errors are typed", () => {
  test("agent.get on a missing target is a HerdrError with the server's code", async () => {
    const e = await client().agent.get("no-such-agent-xyz").catch((x) => x);
    expect(e).toBeInstanceOf(HerdrError);
    expect(typeof e.code).toBe("string");
  });
  test("agent.wait timeout surfaces as code=timeout, not a hang", async () => {
    const c = client();
    const first = (await c.agent.list()).agents[0];
    if (!first) return;
    const e = await c.agent.wait({ target: first.pane_id, until: ["blocked"], timeout_ms: 300 }).catch((x) => x);
    expect(isTimeout(e)).toBe(true);
  });
  test("a dead socket path is a HerdrTransportError", async () => {
    const { HerdrClient } = await import("../../src/index.js");
    const e = await new HerdrClient({ socketPath: "/nonexistent/herdr.sock" }).server.ping().catch((x) => x);
    expect(e).toBeInstanceOf(HerdrTransportError);
  });
});

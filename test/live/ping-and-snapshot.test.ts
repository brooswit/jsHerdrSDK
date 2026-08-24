import { describe, expect, test } from "bun:test";
import { LIVE, client } from "./_live.js";
import { PROTOCOL } from "../../src/index.js";

describe.skipIf(!LIVE)("live: ping + snapshot", () => {
  test("ping returns pong with the protocol we generated against", async () => {
    const r = await client().server.ping();
    expect(r.type).toBe("pong");
    expect(r.protocol).toBe(PROTOCOL);
  });
  test("session.snapshot lists agents with a status from the enum", async () => {
    const r = await client().session.snapshot();
    expect(r.type).toBe("session_snapshot");
    for (const a of r.snapshot.agents) expect(["idle", "working", "blocked", "done", "unknown"]).toContain(a.agent_status);
  });
});

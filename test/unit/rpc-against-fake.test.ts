import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { FakeHerdr } from "../fake/fake-herdr.js";
import { HerdrClient, HerdrError, HerdrTransportError } from "../../src/index.js";

const fake = new FakeHerdr()
  .on("ping", () => ({ result: { type: "pong", version: "fake", protocol: 20, capabilities: {} } }))
  .on("agent.list", () => ({ result: { type: "agent_list", agents: [{ pane_id: "w1:p1", agent: "x", agent_status: "idle" }] } }))
  .on("agent.get", (p) => ({ error: { code: "agent_not_found", message: `no ${p.target}` } }))
  .on("pane.get", () => "close")
  .on("pane.list", () => "garbage")
  .on("tab.list", () => "wrong-id")
  .on("session.snapshot", () => "silent");
let c: HerdrClient;
beforeAll(async () => { await fake.start(); c = new HerdrClient({ socketPath: fake.path, timeoutMs: 300 }); });
afterAll(() => fake.stop());

describe("rpc over a fake herdr", () => {
  test("success result is returned typed", async () => { expect((await c.server.ping()).type).toBe("pong"); });
  test("every service wrapper sends the right method+params", async () => {
    await c.agent.list(); expect(fake.seen.at(-1)).toEqual({ method: "agent.list", params: {} });
    await c.agent.get("a1").catch(() => {}); expect(fake.seen.at(-1)).toEqual({ method: "agent.get", params: { target: "a1" } });
  });
  test("server error → HerdrError with code, method, body", async () => {
    const e = await c.agent.get("zz").catch((x) => x);
    expect(e).toBeInstanceOf(HerdrError); expect(e.code).toBe("agent_not_found"); expect(e.method).toBe("agent.get"); expect(e.message).toContain("[agent_not_found]");
  });
  test("close before response → transport error", async () => { await expect(c.pane.get("p")).rejects.toBeInstanceOf(HerdrTransportError); });
  test("unparseable response → transport error", async () => { await expect(c.pane.list()).rejects.toThrow(/unparseable/); });
  test("a response for a different id is ignored, then close → transport error", async () => { await expect(c.tab.list()).rejects.toThrow(/closed before/); });
  test("client-side timeout fires when the server never answers", async () => {
    await expect(c.session.snapshot()).rejects.toThrow(/no response within 300ms/);
  });
  test("escape hatch call() works for any method", async () => { expect(((await c.call("ping", {})) as any).type).toBe("pong"); });
});

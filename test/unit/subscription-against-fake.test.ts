import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { FakeHerdr } from "../fake/fake-herdr.js";
import { HerdrClient, HerdrError, applyEvent, emptyFleet } from "../../src/index.js";

const fake = new FakeHerdr().on("events.subscribe", () => "stream");
fake.streamFrames = [
  { event: "pane.agent_status_changed", data: { pane_id: "w1:p1", agent: "x", agent_status: "working" } },
  { event: "workspace_created", data: { type: "workspace_created", workspace: { workspace_id: "w9" } } },
  { not: "a frame" },
];
let c: HerdrClient;
beforeAll(async () => { await fake.start(); c = new HerdrClient({ socketPath: fake.path }); });
afterAll(() => fake.stop());

describe("subscription over a fake herdr", () => {
  test("ack, then frames stream through the iterator; non-frames are dropped; close ends it", async () => {
    const sub = await c.subscribe([{ type: "pane.agent_status_changed", pane_id: "w1:p1" }]);
    expect(fake.seen.at(-1)?.method).toBe("events.subscribe");
    const got: any[] = [];
    for await (const f of sub) { got.push(f); if (got.length === 2) break; }
    sub.close();
    expect(got.map((f) => f.event)).toEqual(["pane.agent_status_changed", "workspace_created"]);
    // and the reducer folds the real frame
    expect(applyEvent(emptyFleet(), got[0]).agents["w1:p1"]?.status).toBe("working");
  });
  test("a refused subscribe rejects with HerdrError", async () => {
    const bad = new FakeHerdr().on("events.subscribe", () => ({ error: { code: "invalid_subscription", message: "no" } }));
    await bad.start();
    await expect(new HerdrClient({ socketPath: bad.path }).subscribe([{ type: "layout.updated" }])).rejects.toBeInstanceOf(HerdrError);
    bad.stop();
  });
});

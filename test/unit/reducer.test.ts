import { describe, expect, test } from "bun:test";
import { applyEvent, emptyFleet, fleetFromSnapshot } from "../../src/reducers/index.js";

describe("fleet reducer", () => {
  test("builds from a snapshot", () => {
    const st = fleetFromSnapshot({ type: "session_snapshot", snapshot: { agents: [{ pane_id: "w1:p1", agent: "claude", agent_status: "working" }] } } as any);
    expect(st.agents["w1:p1"]?.status).toBe("working");
  });
  test("status change bumps revision; identical change returns same object", () => {
    const s0 = fleetFromSnapshot({ type: "session_snapshot", snapshot: { agents: [{ pane_id: "w1:p1", agent: "a", agent_status: "idle" }] } } as any);
    const s1 = applyEvent(s0, { event: "pane.agent_status_changed", data: { pane_id: "w1:p1", agent: "a", agent_status: "working" } } as any);
    expect(s1.agents["w1:p1"]?.status).toBe("working"); expect(s1.revision).toBe(1);
    const s2 = applyEvent(s1, { event: "pane.agent_status_changed", data: { pane_id: "w1:p1", agent: "a", agent_status: "working" } } as any);
    expect(s2).toBe(s1);
  });
  test("pane_closed removes the agent; unknown events are no-ops", () => {
    const s0 = applyEvent(emptyFleet(), { event: "pane.agent_status_changed", data: { pane_id: "w1:p9", agent: null, agent_status: "idle" } } as any);
    const s1 = applyEvent(s0, { event: "pane_closed", data: { pane_id: "w1:p9" } } as any);
    expect(s1.agents["w1:p9"]).toBeUndefined();
    expect(applyEvent(s1, { event: "tab_focused", data: {} } as any)).toBe(s1);
  });
});

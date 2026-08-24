import type { results } from "../generated/index.js";
import type { AgentRecord, FleetState } from "./fleet-state.js";

/** Build state from `session.snapshot`. Pure. */
export function fleetFromSnapshot(snap: results.Result_session_snapshot): FleetState {
  const agents: Record<string, AgentRecord> = {};
  for (const a of snap.snapshot.agents ?? []) {
    agents[a.pane_id] = {
      paneId: a.pane_id,
      agent: a.agent ?? null,
      status: (a.agent_status ?? "unknown") as AgentRecord["status"],
      workspaceId: (a as { workspace_id?: string }).workspace_id ?? null,
    };
  }
  return { agents, revision: 0 };
}

import type { PushFrame } from "../generated/events.js";
import type { AgentRecord, FleetState } from "./fleet-state.js";

/**
 * Fold one push frame into state. Pure; returns the SAME object when the frame
 * changes nothing, so callers can cheaply detect "no change".
 */
export function applyEvent(state: FleetState, frame: PushFrame): FleetState {
  const d = frame.data as Record<string, any>;
  switch (frame.event) {
    case "pane.agent_status_changed": {
      const paneId = d.pane_id as string;
      const prev = state.agents[paneId];
      const next: AgentRecord = {
        paneId,
        agent: d.agent ?? prev?.agent ?? null,
        status: d.agent_status,
        workspaceId: prev?.workspaceId ?? null,
      };
      if (prev && prev.status === next.status && prev.agent === next.agent) return state;
      return { agents: { ...state.agents, [paneId]: next }, revision: state.revision + 1 };
    }
    case "pane_closed": {
      const paneId = (d.pane_id ?? d.pane?.pane_id) as string | undefined;
      if (!paneId || !(paneId in state.agents)) return state;
      const { [paneId]: _gone, ...rest } = state.agents;
      return { agents: rest, revision: state.revision + 1 };
    }
    default:
      return state;
  }
}

import type { AgentStatus } from "../generated/events.js";

/** The subset of live state most callers want, kept current by the reducer. */
export interface AgentRecord {
  paneId: string;
  agent: string | null;
  status: AgentStatus;
  workspaceId: string | null;
}

export interface FleetState {
  /** keyed by pane id */
  agents: Readonly<Record<string, AgentRecord>>;
  /** monotonically increasing; bumps on every applied event */
  revision: number;
}

export const emptyFleet = (): FleetState => ({ agents: {}, revision: 0 });

import { Service } from "./base.js";

export class SessionService extends Service {
  /** The whole live state in one read: workspaces, tabs, panes, agents. */
  snapshot() { return this.call("session.snapshot", {}); }
}

import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class TabService extends Service {
  list(p: params.TabListParams = {}) { return this.call("tab.list", p); }
  get(p: params.TabTarget) { return this.call("tab.get", p); }
  create(p: params.TabCreateParams) { return this.call("tab.create", p); }
  focus(p: params.TabTarget) { return this.call("tab.focus", p); }
  rename(p: params.TabRenameParams) { return this.call("tab.rename", p); }
  close(p: params.TabTarget) { return this.call("tab.close", p); }
  move(p: params.TabMoveParams) { return this.call("tab.move", p); }
}

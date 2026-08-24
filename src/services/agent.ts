import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class AgentService extends Service {
  list() { return this.call("agent.list", {}); }
  get(target: string) { return this.call("agent.get", { target }); }
  explain(target: string) { return this.call("agent.explain", { target }); }
  read(p: params.AgentReadParams) { return this.call("agent.read", p); }
  sendKeys(p: params.AgentSendKeysParams) { return this.call("agent.send_keys", p); }
  rename(p: params.AgentRenameParams) { return this.call("agent.rename", p); }
  focus(target: string) { return this.call("agent.focus", { target }); }
  start(p: params.AgentStartParams) { return this.call("agent.start", p); }
  prompt(p: params.AgentPromptParams) { return this.call("agent.prompt", p); }
  /** Blocks server-side until the agent reaches one of `until`; a timeout is a `HerdrError` with code `timeout`. */
  wait(p: params.AgentWaitParams) { return this.call("agent.wait", p); }
  setView(p: params.AgentViewSetParams) { return this.call("agent.view.set", p); }
  clearView(p: params.AgentViewClearParams) { return this.call("agent.view.clear", p); }
}

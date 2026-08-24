import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class PaneService extends Service {
  list(p: params.PaneListParams = {}) { return this.call("pane.list", p); }
  current(p: params.PaneCurrentParams = {}) { return this.call("pane.current", p); }
  get(pane_id: string) { return this.call("pane.get", { pane_id }); }
  read(p: params.PaneReadParams) { return this.call("pane.read", p); }
  focus(pane_id: string) { return this.call("pane.focus", { pane_id }); }
  close(pane_id: string) { return this.call("pane.close", { pane_id }); }
  rename(p: params.PaneRenameParams) { return this.call("pane.rename", p); }
  sendText(p: params.PaneSendTextParams) { return this.call("pane.send_text", p); }
  sendKeys(p: params.PaneSendKeysParams) { return this.call("pane.send_keys", p); }
  sendInput(p: params.PaneSendInputParams) { return this.call("pane.send_input", p); }
  split(p: params.PaneSplitParams) { return this.call("pane.split", p); }
  processInfo(p: params.PaneProcessInfoParams) { return this.call("pane.process_info", p); }
  waitForOutput(p: params.PaneWaitForOutputParams) { return this.call("pane.wait_for_output", p); }
  reportAgent(p: params.PaneReportAgentParams) { return this.call("pane.report_agent", p); }
  reportAgentSession(p: params.PaneReportAgentSessionParams) { return this.call("pane.report_agent_session", p); }
  releaseAgent(p: params.PaneReleaseAgentParams) { return this.call("pane.release_agent", p); }
}

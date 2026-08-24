import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class PluginService extends Service {
  list(p: params.PluginListParams = {}) { return this.call("plugin.list", p); }
  link(p: params.PluginLinkParams) { return this.call("plugin.link", p); }
  unlink(p: params.PluginUnlinkParams) { return this.call("plugin.unlink", p); }
  enable(p: params.PluginSetEnabledParams) { return this.call("plugin.enable", p); }
  disable(p: params.PluginSetEnabledParams) { return this.call("plugin.disable", p); }
  actionList(p: params.PluginActionListParams) { return this.call("plugin.action.list", p); }
  actionInvoke(p: params.PluginActionInvokeParams) { return this.call("plugin.action.invoke", p); }
  logList(p: params.PluginLogListParams) { return this.call("plugin.log.list", p); }
  paneOpen(p: params.PluginPaneOpenParams) { return this.call("plugin.pane.open", p); }
  paneFocus(p: params.PluginPaneFocusParams) { return this.call("plugin.pane.focus", p); }
  paneClose(p: params.PluginPaneCloseParams) { return this.call("plugin.pane.close", p); }
}

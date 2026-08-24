import { Service } from "./base.js";
import type { params } from "../generated/index.js";

/** Things that affect the attached terminal client, not the fleet. */
export class ClientUiService extends Service {
  setWindowTitle(p: params.ClientWindowTitleSetParams) { return this.call("client.window_title.set", p); }
  clearWindowTitle() { return this.call("client.window_title.clear", {}); }
  notify(p: params.NotificationShowParams) { return this.call("notification.show", p); }
  closePopup() { return this.call("popup.close", {}); }
}

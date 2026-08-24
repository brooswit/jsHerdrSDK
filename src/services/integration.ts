import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class IntegrationService extends Service {
  install(p: params.IntegrationInstallParams) { return this.call("integration.install", p); }
  uninstall(p: params.IntegrationUninstallParams) { return this.call("integration.uninstall", p); }
}

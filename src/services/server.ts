import { Service } from "./base.js";

export class ServerService extends Service {
  ping() { return this.call("ping", {}); }
  stop() { return this.call("server.stop", {}); }
  reloadConfig() { return this.call("server.reload_config", {}); }
  agentManifests() { return this.call("server.agent_manifests", {}); }
  reloadAgentManifests() { return this.call("server.reload_agent_manifests", {}); }
}

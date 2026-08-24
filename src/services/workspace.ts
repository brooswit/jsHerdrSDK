import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class WorkspaceService extends Service {
  list() { return this.call("workspace.list", {}); }
  get(p: params.WorkspaceTarget) { return this.call("workspace.get", p); }
  create(p: params.WorkspaceCreateParams) { return this.call("workspace.create", p); }
  focus(p: params.WorkspaceTarget) { return this.call("workspace.focus", p); }
  rename(p: params.WorkspaceRenameParams) { return this.call("workspace.rename", p); }
  close(p: params.WorkspaceTarget) { return this.call("workspace.close", p); }
  reportMetadata(p: params.WorkspaceReportMetadataParams) { return this.call("workspace.report_metadata", p); }
  move(p: params.WorkspaceMoveParams) { return this.call("workspace.move", p); }
  moveBlock(p: params.WorkspaceMoveBlockParams) { return this.call("workspace.move_block", p); }
}

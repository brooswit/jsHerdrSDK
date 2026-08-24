import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class WorktreeService extends Service {
  list(p: params.WorktreeListParams = {}) { return this.call("worktree.list", p); }
  create(p: params.WorktreeCreateParams) { return this.call("worktree.create", p); }
  open(p: params.WorktreeOpenParams) { return this.call("worktree.open", p); }
  remove(p: params.WorktreeRemoveParams) { return this.call("worktree.remove", p); }
}

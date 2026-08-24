import { Service } from "./base.js";
import type { params } from "../generated/index.js";

export class LayoutService extends Service {
  export(p: params.LayoutExportParams) { return this.call("layout.export", p); }
  apply(p: params.LayoutApplyParams) { return this.call("layout.apply", p); }
  setSplitRatio(p: params.LayoutSetSplitRatioParams) { return this.call("layout.set_split_ratio", p); }
}

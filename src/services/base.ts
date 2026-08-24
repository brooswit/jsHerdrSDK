import { rpc, type RpcOptions } from "../client/rpc.js";
import type { Method } from "../generated/params.js";
import type { ParamsOf, ResultOf } from "../client/typed.js";

/** Every service is a thin, typed façade over `rpc`. */
export abstract class Service {
  constructor(protected readonly opts: RpcOptions) {}
  protected call<M extends Method>(method: M, params: ParamsOf<M>): Promise<ResultOf<M>> {
    return rpc(this.opts, method, params);
  }
}

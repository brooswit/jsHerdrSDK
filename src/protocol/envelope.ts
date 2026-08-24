import type { ErrorBody } from "../generated/errors.js";
import type { ResponseResult } from "../generated/results.js";

/** One request line on the wire. */
export interface RequestEnvelope<M extends string = string, P = unknown> {
  id: string;
  method: M;
  params: P;
}

export interface SuccessEnvelope<R = ResponseResult> { id: string; result: R }
export interface ErrorEnvelope { id: string; error: ErrorBody }
export type ResponseEnvelope<R = ResponseResult> = SuccessEnvelope<R> | ErrorEnvelope;

export const isErrorEnvelope = (e: ResponseEnvelope<unknown>): e is ErrorEnvelope =>
  typeof e === "object" && e !== null && "error" in e;

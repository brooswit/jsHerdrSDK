import type { Method, MethodParams } from "../generated/params.js";
import type { METHOD_RESULT, ResponseResult, ResultByTag } from "../generated/results.js";

/** The result type for a method: exact when mapped, the full union otherwise. */
export type ResultOf<M extends Method> = M extends keyof typeof METHOD_RESULT
  ? ResultByTag[(typeof METHOD_RESULT)[M]]
  : ResponseResult;

export type ParamsOf<M extends Method> = MethodParams[M];

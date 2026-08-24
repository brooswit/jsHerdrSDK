import type { ErrorBody } from "../generated/errors.js";

/** The server answered with `{ error }`. `code` is the server's machine-readable code. */
export class HerdrError extends Error {
  override readonly name = "HerdrError";
  constructor(readonly code: string, message: string, readonly method: string, readonly body: ErrorBody) {
    super(`${method}: ${message} [${code}]`);
  }
  static from(method: string, body: ErrorBody): HerdrError {
    return new HerdrError(body.code, body.message, method, body);
  }
}

/** Transport-level failure: socket missing, refused, closed before a response. */
export class HerdrTransportError extends Error {
  override readonly name = "HerdrTransportError";
  constructor(message: string, override readonly cause?: unknown) { super(message); }
}

export const isTimeout = (e: unknown): boolean => e instanceof HerdrError && e.code === "timeout";

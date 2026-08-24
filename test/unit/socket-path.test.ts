import { describe, expect, test } from "bun:test";
import { defaultSocketPath } from "../../src/transport/socket-path.js";
import { nextId } from "../../src/protocol/id.js";
import { isTimeout, HerdrError } from "../../src/protocol/error.js";
describe("small pure bits", () => {
  test("socket path honours HERDR_SOCKET, else ~/.config/herdr", () => {
    expect(defaultSocketPath({ HERDR_SOCKET: "/x.sock" })).toBe("/x.sock");
    expect(defaultSocketPath({ HOME: "/h" })).toBe("/h/.config/herdr/herdr.sock");
  });
  test("ids are unique", () => { expect(nextId()).not.toBe(nextId()); });
  test("isTimeout", () => { expect(isTimeout(new HerdrError("timeout", "m", "x", { code: "timeout", message: "m" }))).toBe(true); expect(isTimeout(new Error("x"))).toBe(false); });
});

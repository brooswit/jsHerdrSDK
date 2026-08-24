import { describe, expect, test } from "bun:test";
import { LineSplitter } from "../../src/transport/line-splitter.js";

describe("LineSplitter", () => {
  test("splits complete lines and holds the partial", () => {
    const s = new LineSplitter();
    expect(s.push('{"a":1}\n{"b":')).toEqual(['{"a":1}']);
    expect(s.pending).toBe('{"b":');
    expect(s.push('2}\n')).toEqual(['{"b":2}']);
    expect(s.pending).toBe("");
  });
  test("drops empty lines, keeps a frame split across three chunks", () => {
    const s = new LineSplitter();
    expect(s.push("\n\n")).toEqual([]);
    expect(s.push("ab")).toEqual([]);
    expect(s.push("c")).toEqual([]);
    expect(s.push("\n")).toEqual(["abc"]);
  });
});

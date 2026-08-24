import { describe, expect, test } from "bun:test";
import { compareInventories, hasDrift, inventoryOf } from "../../scripts/parity/inventory.js";
import { coverage, wrappedMethods } from "../../scripts/parity/coverage.js";
import schema from "../../schema/herdr-api.schema.json";

describe("parity helpers", () => {
  test("a schema compared with itself has no drift", () => {
    const inv = inventoryOf(schema); expect(hasDrift(compareInventories(inv, inv))).toBe(false);
  });
  test("an added method and a changed protocol are both drift", () => {
    const a = inventoryOf(schema); const b = { ...a, methods: [...a.methods, "zzz.new"], protocol: a.protocol + 1 };
    const c = compareInventories(a, b); expect(c.methods.added).toEqual(["zzz.new"]); expect(c.protocol.same).toBe(false); expect(hasDrift(c)).toBe(true);
  });
  test("coverage finds unwrapped and stale", () => {
    const w = wrappedMethods(['this.call("a.b", p)', 'this.call("gone.x", {})']);
    expect(coverage(["a.b", "c.d"], w)).toEqual({ unwrapped: ["c.d"], stale: ["gone.x"] });
  });
});

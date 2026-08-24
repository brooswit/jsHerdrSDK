import { describe, expect, test } from "bun:test";
import { METHODS, METHOD_RESULT, PROTOCOL } from "../../src/generated/index.js";
import schema from "../../schema/herdr-api.schema.json";

describe("generated code agrees with the schema it came from", () => {
  test("every schema method is in METHODS, and nothing extra", () => {
    const fromSchema = (schema as any).schemas.request.oneOf.map((v: any) => v.properties.method.const).sort();
    expect([...METHODS].sort()).toEqual(fromSchema);
  });
  test("every METHOD_RESULT tag exists in the schema's ResponseResult", () => {
    const tags = new Set((schema as any).schemas.success_response.$defs.ResponseResult.oneOf.map((v: any) => v.properties.type.const));
    for (const [m, tag] of Object.entries(METHOD_RESULT)) expect(tags.has(tag), `${m} → ${tag}`).toBe(true);
  });
  test("protocol constant matches", () => { expect(PROTOCOL).toBe((schema as any).protocol); });
});

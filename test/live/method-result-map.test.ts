import { describe, expect, test } from "bun:test";
import { LIVE, client } from "./_live.js";
import { METHOD_RESULT } from "../../src/index.js";

/** Proves the empirically-derived method→result map for every read-only method. */
describe.skipIf(!LIVE)("live: METHOD_RESULT is true for read-only methods", () => {
  const readOnly = ["ping", "session.snapshot", "workspace.list", "agent.list", "pane.list", "tab.list"] as const;
  for (const m of readOnly) {
    test(`${m} → ${METHOD_RESULT[m]}`, async () => {
      const r: any = await client().call(m, {} as any);
      expect(r.type).toBe(METHOD_RESULT[m]);
    });
  }
});

describe.skipIf(!LIVE)("live: worktree.list", () => {
  test("returns worktree_list for a git workspace, or the typed not_git_worktree error", async () => {
    const c = client();
    const { HerdrError } = await import("../../src/index.js");
    const r: any = await c.worktree.list({}).catch((e) => e);
    if (r instanceof HerdrError) expect(r.code).toBe("not_git_worktree");
    else expect(r.type).toBe(METHOD_RESULT["worktree.list"]);
  });
});

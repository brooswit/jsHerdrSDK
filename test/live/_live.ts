import { existsSync } from "node:fs";
import { HerdrClient, defaultSocketPath } from "../../src/index.js";
export const LIVE = process.env.HERDR_LIVE === "1" && existsSync(defaultSocketPath());
export const client = () => new HerdrClient({ timeoutMs: 15_000 });

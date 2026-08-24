import { homedir } from "node:os";
import { join } from "node:path";

/** `HERDR_SOCKET` if set; otherwise herdr's default `~/.config/herdr/herdr.sock`. */
export function defaultSocketPath(env: Record<string, string | undefined> = process.env): string {
  return env.HERDR_SOCKET ?? join(env.HOME ?? homedir(), ".config", "herdr", "herdr.sock");
}

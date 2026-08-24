import { execSync } from "node:child_process";
const out = execSync("git status --porcelain -- src/generated", { encoding: "utf8" }).trim();
if (out) {
  console.error("src/generated is out of date with schema/ — run `bun run generate` and commit:\n" + out);
  process.exit(1);
}
console.log("src/generated matches the committed schema");

import { execSync } from "node:child_process";
const out = execSync("git status --porcelain -- src/generated test/load", { encoding: "utf8" }).trim();
if (out) {
  console.error("src/generated or test/load is out of date — run `bun run generate` and commit:\n" + out);
  process.exit(1);
}
console.log("src/generated and test/load match their sources");

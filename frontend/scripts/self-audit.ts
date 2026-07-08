/**
 * CI gate: audit our own LOOP.md with our own engine, against real git history.
 * Fails the build if our Loop Integrity Score drops below the floor or any line
 * is contradicted. The auditor must hold itself to the standard it publishes.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseLoopMd } from "../lib/loop/parser";
import { verifyLoop } from "../lib/loop/verifier";

const FLOOR = 95;

const root = execFileSync("git", ["rev-parse", "--show-toplevel"]).toString().trim();
const commits = execFileSync("git", ["log", "--pretty=%h|%ct"], { cwd: root })
  .toString()
  .trim()
  .split("\n")
  .map((l) => {
    const [sha, ct] = l.split("|");
    return { sha, timestamp: Number(ct) * 1000 };
  });

const loopMd = readFileSync(join(root, "LOOP.md"), "utf8");
const { lines } = parseLoopMd(loopMd);
// TestSprite runs are not ingested in CI yet; git anchors carry the gate.
const { score, verdicts } = verifyLoop({
  lines,
  commits,
  runs: [],
  available: { commits: true, runs: false },
});

console.log(
  `Loop Integrity: score ${score.score} · integrity ${score.integrity} · coverage ${score.coverage} · ` +
    `${score.verified}/${score.total} verified · ${score.contradicted} contradicted`,
);

const contradicted = verdicts.filter((v) => v.verdict === "contradicted");
if (contradicted.length > 0) {
  console.error(`\n✗ ${contradicted.length} contradicted line(s):`);
  for (const v of contradicted) console.error(`  - ${v.line.raw.slice(0, 100)} :: ${v.reasons.join("; ")}`);
  process.exit(1);
}
if (score.score < FLOOR) {
  console.error(`\n✗ Loop Integrity ${score.score} is below the ${FLOOR} floor.`);
  process.exit(1);
}
console.log(`\n✓ Self-audit passed (>= ${FLOOR}, zero contradicted).`);

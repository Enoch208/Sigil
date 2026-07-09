/**
 * Full run-verification: fetch this repo's LOOP.md run IDs from TestSprite and
 * cross-check them with our own verifier (git AND run sources available). Proves
 * the loop is run-verified by the engine itself, not only via the CLI.
 *
 * Requires the TestSprite CLI to be configured. Not part of the CI gate (which
 * stays git-only); this is the stronger local/demo proof.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseLoopMd } from "../lib/loop/parser";
import { verifyLoop } from "../lib/loop/verifier";
import { mapTestSpriteRun } from "../lib/loop/ingest/testsprite";
import type { Run } from "../lib/loop/types";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"]).toString().trim();
const commits = execFileSync("git", ["log", "--pretty=%h|%ct"], { cwd: root })
  .toString().trim().split("\n")
  .map((l) => { const [sha, ct] = l.split("|"); return { sha, timestamp: Number(ct) * 1000 }; });

const { lines } = parseLoopMd(readFileSync(join(root, "LOOP.md"), "utf8"));
const runIds = [...new Set(lines.map((l) => l.runId).filter((x): x is string => Boolean(x)))];
console.log(`run IDs referenced in LOOP.md: ${runIds.length}`);

const runs: Run[] = [];
for (const id of runIds) {
  let out = "";
  try {
    out = execFileSync("testsprite", ["test", "wait", id, "--output", "json"]).toString();
  } catch (e) {
    out = (e as { stdout?: Buffer }).stdout?.toString() ?? "";
  }
  if (out) {
    try { runs.push(mapTestSpriteRun(JSON.parse(out))); } catch { /* skip unparseable */ }
  }
}
console.log(`fetched from TestSprite: ${runs.length} runs [${runs.map((r) => r.verdict).join(", ")}]`);

const report = verifyLoop({ lines, commits, runs, available: { commits: true, runs: true } });
console.log("SCORE:", JSON.stringify(report.score));
console.log("run-anchored lines (now cross-checked against TestSprite):");
for (const v of report.verdicts) {
  if (!v.line.runId) continue;
  const rc = v.checks.filter((c) => c.check.startsWith("run")).map((c) => `${c.check}:${c.status}`).join(" ");
  console.log(`  ${v.line.testId}  ${v.verdict}  [${rc}]`);
}

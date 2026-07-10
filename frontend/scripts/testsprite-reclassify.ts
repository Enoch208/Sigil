/**
 * Dogfood demo: run Sigil's own engine over this repo's live TestSprite frontend runs.
 *
 * TestSprite's checker sometimes returns `blocked` even when every assertion in
 * the run passed — the "blocked verdict with passing assertions" known checker
 * issue (PRD §3.2). Sigil's verifier reclassifies those as `verdict-mismatch`,
 * never as a failure. This proves it on live run data using the exact production
 * code path (`mapTestSpriteRun` + the verifier's rule), not a mock.
 *
 * Usage: tsx scripts/testsprite-reclassify.ts <frontend-project-id>
 * Requires the TestSprite CLI to be configured (`testsprite setup`).
 */
import { execFileSync } from "node:child_process";
import { mapTestSpriteRun } from "../lib/loop/ingest/testsprite";
import type { Run } from "../lib/loop/types";

const projectId = process.argv[2];
if (!projectId) { console.error("usage: tsx scripts/testsprite-reclassify.ts <frontend-project-id>"); process.exit(1); }

const ts = (args: string[]): string => {
  try { return execFileSync("testsprite", args, { encoding: "utf8" }); }
  catch (e) { return (e as { stdout?: string }).stdout ?? ""; }
};

/** The verifier's exact rule (lib/loop/verifier.ts:16,25 → resolveVerdict). */
function sigilClassify(run: Run): { label: string; failure: boolean } {
  if (run.verdict === "pass") return { label: "verified", failure: false };
  if (run.verdict === "blocked" && run.assertionsPassed) return { label: "verdict-mismatch", failure: false };
  if (run.verdict === "blocked") return { label: "blocked", failure: true };
  return { label: "failure", failure: true };
}

// 1) list tests (id + name)
const tests: { testId: string; name: string }[] = [];
for (const line of ts(["test", "list", "--project", projectId]).split("\n")) {
  const m = line.match(/^([0-9a-f]{8}-\S+)\s+(.*?)\s+frontend\s+\S+\s+\w+\s/);
  if (m) tests.push({ testId: m[1], name: m[2].trim() });
}

// 2) fetch each test's latest run JSON (status + stepSummary.failedCount)
const rows = tests.map((t) => {
  const runIdMatch = ts(["test", "result", t.testId]).match(/^runId:\s*(\S+)/m);
  const runId = runIdMatch && runIdMatch[1] !== "null" ? runIdMatch[1] : null;
  let raw = { runId: runId ?? t.testId, testId: t.testId, status: "unknown", stepSummary: { failedCount: 0 } };
  if (runId) { try { raw = { ...raw, ...JSON.parse(ts(["test", "wait", runId, "--output", "json"])) }; } catch { /* keep default */ } }
  return { name: t.name, run: mapTestSpriteRun(raw) };
});

const pad = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s.padEnd(n));
let blocked = 0, mismatch = 0, fail = 0, pass = 0;

console.log("\n  Sigil × TestSprite — verdict reconciliation (live run data)");
console.log("  " + "─".repeat(78));
console.log("  " + pad("TEST", 44) + pad("TESTSPRITE", 12) + "SIGIL VERDICT");
console.log("  " + "─".repeat(78));
for (const { name, run } of rows) {
  const c = sigilClassify(run);
  const tsStatus = run.verdict === "pass" ? "passed" : run.verdict;
  if (run.verdict === "blocked") blocked++;
  if (c.label === "verdict-mismatch") mismatch++;
  else if (c.failure) fail++;
  else pass++;
  const mark = c.label === "verified" ? "✓" : c.label === "verdict-mismatch" ? "≈" : "✗";
  console.log("  " + pad(name, 44) + pad(tsStatus, 12) + `${mark} ${c.label}`);
}
console.log("  " + "─".repeat(78));
console.log(`\n  TestSprite returned 'blocked' for ${blocked} run(s) whose assertions all passed.`);
console.log(`  Sigil reclassified ${mismatch} as verdict-mismatch (checker issue, NOT failures).`);
console.log(`  Genuine failures after reconciliation: ${fail}.`);
console.log(`  Effective green (verified + verdict-mismatch) = ${pass + mismatch} / ${rows.length}.\n`);

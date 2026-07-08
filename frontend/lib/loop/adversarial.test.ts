import { describe, it, expect } from "vitest";
import { parseLoopMd } from "./parser";
import { verifyLoop } from "./verifier";

/**
 * Regression guard for the auditor's most important property: it must NEVER
 * manufacture a contradiction from prose or markdown tables. These inputs mirror
 * real Season 3 LOOP.md files (narrative logs, backtick SHAs in tables, the
 * English word "run"/"commit" in sentences) that previously produced false
 * contradictions. A false accusation destroys an auditor's credibility.
 */
const REAL_WORLD_PROSE = [
  "## Iteration log",
  "| Step | Result |",
  "| 28 | **PASS** 12/12 — CLI timed out at 600s; run finished ~10 min later |",
  "Re-run `test run --wait` after the Render deploy finished.",
  "Verified: compared the failing pattern against `.github/workflows/verify-loop.yml`.",
  "We then commit the fix and run the whole suite again — everything PASS.",
  "Backtick SHAs like `9c5d5682` and `b112f1ec` appear in the table but not as claims.",
].join("\n");

describe("adversarial: prose/table logs never fabricate contradictions", () => {
  it("marks narrative lines unverifiable and reports zero contradicted", () => {
    const { lines } = parseLoopMd(REAL_WORLD_PROSE);
    const report = verifyLoop({ lines, commits: [], runs: [] });
    expect(report.score.contradicted).toBe(0);
    expect(report.verdicts.every((v) => v.verdict !== "contradicted")).toBe(true);
  });

  it("extracts no false commit/run anchors from prose", () => {
    const { lines } = parseLoopMd(REAL_WORLD_PROSE);
    for (const line of lines) {
      expect(line.commitSha).toBeUndefined();
      expect(line.runId).toBeUndefined();
    }
  });

  it("still verifies a genuine machine-checkable line mixed into the same log", () => {
    const src =
      REAL_WORLD_PROSE +
      '\n[maker=x] [iter=1] TC-A-01 "real" → PASS banked [commit abc1234 · run r_1]';
    const { lines } = parseLoopMd(src);
    const report = verifyLoop({
      lines,
      commits: [{ sha: "abc1234", timestamp: 1000 }],
      runs: [{ id: "r_1", verdict: "pass", assertionsPassed: true, timestamp: 1100, testId: "TC-A-01" }],
    });
    expect(report.score.contradicted).toBe(0);
    expect(report.verdicts.some((v) => v.verdict === "verified")).toBe(true);
  });
});

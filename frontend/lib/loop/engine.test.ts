import { describe, it, expect } from "vitest";
import { parseLoopMd, verifyLoop } from "./index";
import { CLEAN_LOOP_MD, CLEAN_COMMITS, CLEAN_RUNS } from "./fixtures/clean";

describe("core engine — end to end", () => {
  it("scores a clean, fully machine-checkable log 100 with zero contradictions (PRD 'our own log' ≥95)", () => {
    const { lines } = parseLoopMd(CLEAN_LOOP_MD);
    const report = verifyLoop({ lines, commits: CLEAN_COMMITS, runs: CLEAN_RUNS });

    expect(report.score.contradicted).toBe(0);
    expect(report.score.integrity).toBe(100);
    expect(report.score.score).toBeGreaterThanOrEqual(95);
    expect(
      report.verdicts.every(
        (v) => v.verdict === "verified" || v.verdict === "verdict-mismatch",
      ),
    ).toBe(true);
  });

  it("flags a contradiction and drops the score when a commit SHA is tampered", () => {
    const tampered = CLEAN_LOOP_MD.replace("bbb2222", "deadbee");
    const { lines } = parseLoopMd(tampered);
    const report = verifyLoop({ lines, commits: CLEAN_COMMITS, runs: CLEAN_RUNS });

    expect(report.score.contradicted).toBe(1);
    expect(report.score.score).toBeLessThan(100);
    expect(report.verdicts.some((v) => v.verdict === "contradicted")).toBe(true);
  });
});

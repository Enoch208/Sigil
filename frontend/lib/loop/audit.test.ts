import { describe, it, expect } from "vitest";
import { audit } from "./audit";
import { CLEAN_LOOP_MD, CLEAN_COMMITS, CLEAN_RUNS } from "./fixtures/clean";

describe("audit — parse + verify + timeline in one pass", () => {
  it("produces a report and timeline for a clean project", () => {
    const { report, timeline } = audit({
      loopMarkdown: CLEAN_LOOP_MD,
      commits: CLEAN_COMMITS,
      runs: CLEAN_RUNS,
    });
    expect(report.score.score).toBeGreaterThanOrEqual(95);
    expect(report.score.contradicted).toBe(0);
    expect(timeline.iterations).toBe(3);
    expect(timeline.banked).toBe(3);
  });

  it("handles empty input without crashing", () => {
    const { report, timeline } = audit({ loopMarkdown: "", commits: [], runs: [] });
    expect(report.verdicts).toEqual([]);
    expect(timeline.events).toEqual([]);
  });
});

import { describe, it, expect } from "vitest";
import { parseLoopMd } from "./parser";
import { verifyLoop } from "./verifier";
import { buildTimeline } from "./timeline";
import { CLEAN_LOOP_MD, CLEAN_COMMITS, CLEAN_RUNS } from "./fixtures/clean";

function cleanTimeline() {
  const { lines } = parseLoopMd(CLEAN_LOOP_MD);
  const report = verifyLoop({ lines, commits: CLEAN_COMMITS, runs: CLEAN_RUNS });
  return buildTimeline(report, { commits: CLEAN_COMMITS, runs: CLEAN_RUNS });
}

describe("buildTimeline — replay rail (PRD §3.3)", () => {
  it("emits one ordered event per loop line, narrated by its raw text", () => {
    const t = cleanTimeline();
    expect(t.events).toHaveLength(3);
    expect(t.events.map((e) => e.order)).toEqual([0, 1, 2]);
    expect(t.events[0].narration).toContain("TC-PARSE-01");
    expect(t.events[1].testId).toBe("TC-VERIFY-04");
  });

  it("timestamps each event by the run that turned it green", () => {
    const t = cleanTimeline();
    expect(t.events.map((e) => e.timestamp)).toEqual([1500, 2500, 3500]);
  });
});

describe("buildTimeline — metrics", () => {
  it("computes time-to-green per test from first failure to banked pass", () => {
    const t = cleanTimeline();
    const parse = t.timeToGreen.find((g) => g.testId === "TC-PARSE-01");
    expect(parse).toMatchObject({ firstFailAt: 500, greenAt: 1500, ms: 1000 });
    expect(t.timeToGreen).toHaveLength(3);
  });

  it("tracks cumulative banked-suite growth over time", () => {
    const t = cleanTimeline();
    expect(t.bankedGrowth).toEqual([
      { at: 1500, banked: 1 },
      { at: 2500, banked: 2 },
      { at: 3500, banked: 3 },
    ]);
  });

  it("reports iteration and banked totals", () => {
    const t = cleanTimeline();
    expect(t.iterations).toBe(3);
    expect(t.banked).toBe(3);
  });
});

describe("buildTimeline — empty loop", () => {
  it("returns empty structures without crashing", () => {
    const report = verifyLoop({ lines: [], commits: [], runs: [] });
    const t = buildTimeline(report, { commits: [], runs: [] });
    expect(t).toEqual({
      events: [],
      timeToGreen: [],
      bankedGrowth: [],
      iterations: 0,
      banked: 0,
    });
  });
});

import { describe, it, expect } from "vitest";
import { aggregateSeason } from "./season";
import { scoreLoop } from "./scoring";
import type {
  CheckName,
  LineVerdict,
  LoopTimeline,
  SeasonProject,
  Verdict,
} from "./types";

function v(verdict: Verdict, failingCheck?: CheckName): LineVerdict {
  return {
    line: { raw: "", sourceLineNo: 0, parseFlags: [] },
    verdict,
    checks: failingCheck ? [{ check: failingCheck, status: "fail" }] : [],
    reasons: [],
  };
}

function project(
  handle: string,
  name: string,
  verdicts: LineVerdict[],
  timeline: Partial<LoopTimeline> = {},
): SeasonProject {
  return {
    handle,
    project: name,
    report: { verdicts, score: scoreLoop(verdicts) },
    timeline: {
      events: [],
      timeToGreen: [],
      bankedGrowth: [],
      iterations: verdicts.length,
      banked: 0,
      ...timeline,
    },
  };
}

describe("aggregateSeason — index rows", () => {
  it("ranks projects by score and labels their status", () => {
    const clean = project("a", "clean", [v("verified"), v("verified")], { banked: 2 });
    const broken = project("b", "broken", [v("verified"), v("contradicted", "sha-exists")]);
    const summary = aggregateSeason([broken, clean]);

    expect(summary.entries.map((e) => e.project)).toEqual(["clean", "broken"]);
    expect(summary.entries[0].status).toBe("verified");
    expect(summary.entries[1].status).toBe("contested");
  });

  it("orders ties deterministically by handle/project (TC-PUB-09)", () => {
    const p1 = project("zeta", "x", [v("verified")]);
    const p2 = project("alpha", "x", [v("verified")]);
    const first = aggregateSeason([p1, p2]).entries.map((e) => e.handle);
    const second = aggregateSeason([p2, p1]).entries.map((e) => e.handle);
    expect(first).toEqual(["alpha", "zeta"]);
    expect(second).toEqual(first);
  });
});

describe("aggregateSeason — failure fingerprints", () => {
  it("clusters contradicted lines by their failing check across projects", () => {
    const a = project("a", "one", [v("contradicted", "sha-exists")]);
    const b = project("b", "two", [
      v("contradicted", "sha-exists"),
      v("contradicted", "run-verdict"),
    ]);
    const { fingerprints } = aggregateSeason([a, b]);

    expect(fingerprints[0]).toEqual({ signature: "sha-exists", count: 2, projects: 2 });
    expect(fingerprints.find((f) => f.signature === "run-verdict")).toEqual({
      signature: "run-verdict",
      count: 1,
      projects: 1,
    });
  });
});

describe("aggregateSeason — season analytics", () => {
  it("averages time-to-green across all failures", () => {
    const a = project("a", "one", [v("verified")], {
      timeToGreen: [{ testId: "T1", firstFailAt: 0, greenAt: 1000, ms: 1000 }],
    });
    const b = project("b", "two", [v("verified")], {
      timeToGreen: [{ testId: "T2", firstFailAt: 0, greenAt: 3000, ms: 3000 }],
    });
    expect(aggregateSeason([a, b]).avgTimeToGreenMs).toBe(2000);
  });

  it("reports null average when there is no time-to-green data", () => {
    expect(aggregateSeason([project("a", "one", [v("verified")])]).avgTimeToGreenMs).toBeNull();
  });

  it("computes verdict-mismatch rate over checkable lines", () => {
    const p = project("a", "one", [
      v("verified"),
      v("verdict-mismatch"),
      v("contradicted", "run-verdict"),
      v("unverifiable"),
    ]);
    // checkable = verified + mismatch + contradicted = 3; mismatch = 1 -> 1/3
    expect(aggregateSeason([p]).verdictMismatchRate).toBeCloseTo(1 / 3, 5);
  });

  it("sums season totals", () => {
    const a = project("a", "one", [v("verified"), v("verified")], { banked: 2 });
    const b = project("b", "two", [v("contradicted", "sha-exists")], { banked: 0 });
    const { totals } = aggregateSeason([a, b]);
    expect(totals).toEqual({ projects: 2, iterations: 3, banked: 2, contradicted: 1 });
  });
});

describe("aggregateSeason — empty season", () => {
  it("returns neutral zeros without crashing", () => {
    expect(aggregateSeason([])).toEqual({
      entries: [],
      totals: { projects: 0, iterations: 0, banked: 0, contradicted: 0 },
      fingerprints: [],
      avgTimeToGreenMs: null,
      verdictMismatchRate: 0,
    });
  });
});

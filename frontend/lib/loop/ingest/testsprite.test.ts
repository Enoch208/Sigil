import { describe, it, expect } from "vitest";
import { mapTestSpriteRun } from "./testsprite";

const base = {
  runId: "r-1",
  testId: "t-1",
  finishedAt: "2026-07-09T06:06:38.175Z",
  stepSummary: { total: 0, completed: 0, passedCount: 0, failedCount: 0 },
};

describe("mapTestSpriteRun", () => {
  it("maps a passed run to a passing verdict with the run id and timestamp", () => {
    const r = mapTestSpriteRun({ ...base, status: "passed" });
    expect(r.id).toBe("r-1");
    expect(r.verdict).toBe("pass");
    expect(r.assertionsPassed).toBe(true);
    expect(r.timestamp).toBe(Date.parse("2026-07-09T06:06:38.175Z"));
    expect(r.testId).toBe("t-1");
  });

  it("maps a failed run to a failing verdict", () => {
    const r = mapTestSpriteRun({ ...base, status: "failed", stepSummary: { failedCount: 2 } });
    expect(r.verdict).toBe("fail");
    expect(r.assertionsPassed).toBe(false);
  });

  it("maps a blocked run with zero failed steps to blocked + assertionsPassed (verdict-mismatch case)", () => {
    const r = mapTestSpriteRun({ ...base, status: "blocked", stepSummary: { failedCount: 0 } });
    expect(r.verdict).toBe("blocked");
    expect(r.assertionsPassed).toBe(true);
  });

  it("maps a blocked run with failed steps to blocked + assertions failed", () => {
    const r = mapTestSpriteRun({ ...base, status: "blocked", stepSummary: { failedCount: 3 } });
    expect(r.verdict).toBe("blocked");
    expect(r.assertionsPassed).toBe(false);
  });

  it("treats cancelled/unknown status as a failure", () => {
    expect(mapTestSpriteRun({ ...base, status: "cancelled" }).verdict).toBe("fail");
  });
});

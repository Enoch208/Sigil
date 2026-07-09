import { describe, it, expect } from "vitest";
import { scoreLoop, grade } from "./scoring";
import type { LineVerdict, Verdict } from "./types";

function verdicts(verdict: Verdict, n: number): LineVerdict[] {
  return Array.from({ length: n }, () => ({
    line: { raw: "", sourceLineNo: 0, parseFlags: [] },
    verdict,
    checks: [],
    reasons: [],
  }));
}

describe("scoreLoop — published methodology", () => {
  it("scores a fully verified log 100 with zero contradictions", () => {
    const s = scoreLoop(verdicts("verified", 5));
    expect(s.score).toBe(100);
    expect(s.integrity).toBe(100);
    expect(s.coverage).toBe(100);
    expect(s.checkable).toBe(5);
    expect(s.verified).toBe(5);
    expect(s.contradicted).toBe(0);
  });

  it("drops score steeply when a line is contradicted", () => {
    // 19 verified + 1 contradicted, all checkable
    const s = scoreLoop([...verdicts("verified", 19), ...verdicts("contradicted", 1)]);
    expect(s.integrity).toBe(95); // 19/20
    expect(s.score).toBe(70); // 95 - 25
    expect(s.contradicted).toBe(1);
    expect(s.coverage).toBe(100);
  });

  it("never lowers the score of a log that has verified content because of unverifiable lines", () => {
    // 8 verified + 2 unverifiable
    const s = scoreLoop([...verdicts("verified", 8), ...verdicts("unverifiable", 2)]);
    expect(s.score).toBe(100);
    expect(s.integrity).toBe(100);
    expect(s.coverage).toBe(80); // 8 of 10 checkable
    expect(s.unverifiable).toBe(2);
    expect(s.checkable).toBe(8);
  });

  it("counts verdict-mismatch as passing, not as a failure", () => {
    const s = scoreLoop([...verdicts("verified", 3), ...verdicts("verdict-mismatch", 1)]);
    expect(s.score).toBe(100);
    expect(s.integrity).toBe(100);
    expect(s.verdictMismatch).toBe(1);
  });

  it("scores an entirely unverifiable log 0, not 100 (anti-gaming)", () => {
    const s = scoreLoop(verdicts("unverifiable", 5));
    expect(s.score).toBe(0);
    expect(s.integrity).toBe(0);
    expect(s.coverage).toBe(0);
    expect(s.checkable).toBe(0);
  });

  it("returns zeros for an empty log", () => {
    const s = scoreLoop([]);
    expect(s).toMatchObject({ score: 0, coverage: 0, integrity: 0, total: 0 });
  });

  it("clamps the score at 0 under many contradictions", () => {
    // 1 verified + 4 contradicted: 20 - 100 -> clamp 0
    const s = scoreLoop([...verdicts("verified", 1), ...verdicts("contradicted", 4)]);
    expect(s.score).toBe(0);
  });
});

describe("grade — a letter grade from the score", () => {
  it("maps score bands to letters", () => {
    expect(grade(100)).toBe("A+");
    expect(grade(96)).toBe("A");
    expect(grade(88)).toBe("B");
    expect(grade(72)).toBe("C");
    expect(grade(55)).toBe("D");
    expect(grade(30)).toBe("F");
  });
});

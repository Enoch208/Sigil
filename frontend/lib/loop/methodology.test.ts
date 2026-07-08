import { describe, it, expect } from "vitest";
import { getMethodology } from "./methodology";
import { PENALTY_PER_CONTRADICTION } from "./scoring";

describe("getMethodology — matches engine constants (TC-VERIFY-12)", () => {
  it("mirrors the verifier's contradiction penalty as its single source of truth", () => {
    const m = getMethodology();
    expect(m.penaltyPerContradiction).toBe(PENALTY_PER_CONTRADICTION);
    expect(m.formulas.score).toContain(String(PENALTY_PER_CONTRADICTION));
  });

  it("documents every verdict the verifier can emit", () => {
    const verdicts = getMethodology()
      .verdicts.map((v) => v.verdict)
      .sort();
    expect(verdicts).toEqual([
      "contradicted",
      "unverifiable",
      "verdict-mismatch",
      "verified",
    ]);
  });

  it("documents every cross-check the verifier runs", () => {
    const checks = getMethodology()
      .checks.map((c) => c.check)
      .sort();
    expect(checks).toEqual([
      "banked-pass",
      "run-exists",
      "run-verdict",
      "sha-exists",
      "sha-order",
      "timestamp-coherence",
    ]);
  });

  it("states the unverifiable-neutral and anti-gaming principles", () => {
    const notes = getMethodology().notes.join(" ").toLowerCase();
    expect(notes).toContain("unverifiable");
    expect(notes).toContain("anti-gaming");
  });
});

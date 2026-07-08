import type { CheckName, Verdict } from "./types";
import { PENALTY_PER_CONTRADICTION } from "./scoring";

export interface MethodologyDoc {
  version: string;
  penaltyPerContradiction: number;
  formulas: { coverage: string; integrity: string; score: string };
  verdicts: { verdict: Verdict; label: string; meaning: string }[];
  checks: { check: CheckName; description: string }[];
  notes: string[];
}

/**
 * The published scoring methodology, rendered by the public /methodology page.
 * Every number here is derived from the engine (not restated), so the page can
 * never drift from the code — the core credibility of "auditor as infrastructure".
 */
export function getMethodology(): MethodologyDoc {
  return {
    version: "1",
    penaltyPerContradiction: PENALTY_PER_CONTRADICTION,
    formulas: {
      coverage: "Coverage = checkable / total",
      integrity: "Integrity = (verified + verdict-mismatch) / checkable",
      score: `Score = clamp(round(100 × Integrity) − ${PENALTY_PER_CONTRADICTION} × contradicted, 0, 100)`,
    },
    verdicts: [
      {
        verdict: "verified",
        label: "Verified",
        meaning: "Every applicable cross-check confirmed the line against git and run history.",
      },
      {
        verdict: "unverifiable",
        label: "Unverifiable",
        meaning:
          "The line carries no machine-checkable anchor (no commit SHA or run ID). Marked neutrally; it never lowers the score of a log that has verified content.",
      },
      {
        verdict: "contradicted",
        label: "Contradicted",
        meaning: "A source refutes the line — a missing/out-of-order SHA, a mismatched run verdict, an incoherent timestamp, or a pass that did not bank.",
      },
      {
        verdict: "verdict-mismatch",
        label: "Verdict mismatch",
        meaning:
          "The run reported 'blocked' while every assertion passed — a known checker issue. Counted as passing, never as a failure, and never hidden.",
      },
    ],
    checks: [
      { check: "sha-exists", description: "The claimed commit SHA exists in git history." },
      { check: "sha-order", description: "Commits land in chronological order across the loop." },
      { check: "run-exists", description: "The claimed run ID exists in run history." },
      { check: "run-verdict", description: "The recorded run verdict matches the line's claim." },
      { check: "timestamp-coherence", description: "The fix commit lands between the FAIL run and the PASS run." },
      { check: "banked-pass", description: "A claimed banked pass is not refuted by a later failing run." },
    ],
    notes: [
      "Unverifiable lines are neutral: they lower Coverage, never the score of a log that has verified content.",
      "Anti-gaming: a log with zero checkable lines scores 0, not 100 — an unproven log is not a trusted one. This is not a penalty on individual unverifiable lines.",
      "A 'blocked' verdict with passing assertions is classified as a verdict mismatch (known checker issue), never as a failure.",
    ],
  };
}

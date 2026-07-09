import type { LineVerdict, LoopScore } from "./types";

/**
 * Points removed from the headline score per contradicted line. This is the
 * single tunable in the methodology; the public /methodology page must render
 * this exact constant. See the design spec for rationale.
 */
export const PENALTY_PER_CONTRADICTION = 25;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/** A letter grade for a Loop Integrity Score, for at-a-glance UI. */
export function grade(score: number): "A+" | "A" | "B" | "C" | "D" | "F" {
  if (score >= 100) return "A+";
  if (score >= 95) return "A";
  if (score >= 85) return "B";
  if (score >= 70) return "C";
  if (score >= 50) return "D";
  return "F";
}

/**
 * Compute the published Loop Integrity Score and its honest sub-metrics.
 *
 *   checkable  = verified + verdictMismatch + contradicted
 *   Coverage   = checkable / total
 *   Integrity  = (verified + verdictMismatch) / checkable   (0 when nothing is checkable)
 *   Score      = clamp( Integrity*100 - 25*contradicted, 0, 100 )
 *
 * Unverifiable lines never lower the score of a log that has verified content;
 * they only lower Coverage. A log with no checkable lines scores 0 — an
 * unproven log is not a trusted one (anti-gaming), which is distinct from
 * penalising individual unverifiable lines.
 */
export function scoreLoop(verdicts: LineVerdict[]): LoopScore {
  let verified = 0;
  let verdictMismatch = 0;
  let unverifiable = 0;
  let contradicted = 0;

  for (const v of verdicts) {
    switch (v.verdict) {
      case "verified":
        verified++;
        break;
      case "verdict-mismatch":
        verdictMismatch++;
        break;
      case "unverifiable":
        unverifiable++;
        break;
      case "contradicted":
        contradicted++;
        break;
    }
  }

  const total = verdicts.length;
  const checkable = verified + verdictMismatch + contradicted;
  const held = verified + verdictMismatch;
  const integrityRatio = checkable === 0 ? 0 : held / checkable;

  const coverage = total === 0 ? 0 : Math.round((100 * checkable) / total);
  const integrity = Math.round(100 * integrityRatio);
  const score = clamp(
    Math.round(100 * integrityRatio) - PENALTY_PER_CONTRADICTION * contradicted,
    0,
    100,
  );

  return {
    score,
    coverage,
    integrity,
    total,
    checkable,
    verified,
    verdictMismatch,
    unverifiable,
    contradicted,
  };
}

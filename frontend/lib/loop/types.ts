/**
 * Domain contracts for the Sigil core engine.
 *
 * These types are the stable interface between the pure logic layer
 * (parser → verifier → scoring) and everything that consumes it: the UI,
 * the ingestion adapters, and persistence. No logic lives here.
 *
 * See docs/superpowers/specs/2026-07-08-loop-core-engine-design.md
 */

/** The final claimed outcome of a LOOP.md line (its last PASS/FAIL token). */
export type ClaimedVerdict = "pass" | "fail";

/** A verdict as recorded by the checker for a single run. */
export type RunVerdict = "pass" | "fail" | "blocked";

/** Non-fatal issues discovered while parsing a candidate loop line. */
export type ParseFlag =
  | "missing-maker"
  | "missing-iter"
  | "malformed-iter"
  | "missing-test-id"
  | "no-verdict"
  | "no-anchors"
  | "duplicate-iter";

/** One parsed line of a LOOP.md log. All extracted fields are optional. */
export interface LoopLine {
  /** The original, untrimmed source line. */
  raw: string;
  /** 1-based line number within the LOOP.md source. */
  sourceLineNo: number;
  /** From `[maker=<x>]`. */
  maker?: string;
  /** From `[iter=<n>]`, parsed to a number when numeric. */
  iter?: number;
  /** e.g. `TC-VERIFY-04`. */
  testId?: string;
  /** First quoted segment on the line. */
  description?: string;
  /** The final PASS/FAIL on the line. */
  claimedVerdict?: ClaimedVerdict;
  /** From `commit <sha>`. */
  commitSha?: string;
  /** From `run <id>`. */
  runId?: string;
  /** Whether the line claims the pass was banked. */
  banked?: boolean;
  /** Non-fatal parse issues; never causes a throw. */
  parseFlags: ParseFlag[];
}

/** The result of parsing a whole LOOP.md document. */
export interface ParsedLoop {
  /** Candidate loop lines, in source order. */
  lines: LoopLine[];
  /** Number of parsed loop lines (== lines.length). */
  totalLines: number;
  /** Non-loop lines skipped (blank, headings, fenced code, prose). */
  ignored: number;
}

/** A git commit, as supplied by a GitSource. */
export interface Commit {
  sha: string;
  /** Unix epoch milliseconds. */
  timestamp: number;
  message?: string;
}

/** A TestSprite run, as supplied by a RunSource. */
export interface Run {
  id: string;
  verdict: RunVerdict;
  /** Whether every assertion in the run passed (distinguishes real blocks). */
  assertionsPassed: boolean;
  /** Unix epoch milliseconds. */
  timestamp: number;
  /** The test this run exercised, when known. */
  testId?: string;
}

/** The per-line verdict produced by the verifier. */
export type Verdict =
  | "verified"
  | "unverifiable"
  | "contradicted"
  | "verdict-mismatch";

/** The individual cross-checks the verifier runs. */
export type CheckName =
  | "sha-exists"
  | "sha-order"
  | "run-exists"
  | "run-verdict"
  | "timestamp-coherence"
  | "banked-pass";

/** Outcome of a single cross-check for one line. */
export interface CheckResult {
  check: CheckName;
  status: "pass" | "fail" | "skipped";
  detail?: string;
}

/** A line paired with its verdict, the checks that ran, and human reasons. */
export interface LineVerdict {
  line: LoopLine;
  verdict: Verdict;
  checks: CheckResult[];
  /** Human-readable explanations, for neutral methodology-linked UI. */
  reasons: string[];
}

/** The published Loop Integrity Score plus its honest sub-metrics. */
export interface LoopScore {
  /** Headline 0–100 score. */
  score: number;
  /** % of lines that were machine-checkable. */
  coverage: number;
  /** % of checkable lines that held up. */
  integrity: number;
  total: number;
  checkable: number;
  verified: number;
  verdictMismatch: number;
  unverifiable: number;
  contradicted: number;
}

/** The full output of verifying a loop against its sources. */
export interface LoopReport {
  verdicts: LineVerdict[];
  score: LoopScore;
}

/** Input to the verifier: parsed lines plus the two evidence sources. */
export interface VerifyInput {
  lines: LoopLine[];
  commits: Commit[];
  runs: Run[];
  /**
   * Which evidence sources were actually ingested. A source marked unavailable
   * makes its anchored checks skip (lines relying solely on it become
   * unverifiable, never contradicted). Both default to available.
   */
  available?: { commits?: boolean; runs?: boolean };
}

/** One point on the replay rail — a single loop line, narrated by its raw text. */
export interface TimelineEvent {
  /** 0-based sequence position in the loop. */
  order: number;
  iter?: number;
  testId?: string;
  verdict: Verdict;
  banked: boolean;
  /** When it went green (pass run), falling back to the commit time. */
  timestamp?: number;
  commitSha?: string;
  runId?: string;
  /** The original LOOP.md line, for replay narration. */
  narration: string;
}

/** Time from a test's first failure to its banked pass. */
export interface TimeToGreen {
  testId: string;
  firstFailAt: number;
  greenAt: number;
  ms: number;
}

/** Cumulative banked-pass count at a point in time. */
export interface BankedPoint {
  at: number;
  banked: number;
}

/** Derived, UI-ready view of a finished loop (PRD §3.3). */
export interface LoopTimeline {
  events: TimelineEvent[];
  timeToGreen: TimeToGreen[];
  bankedGrowth: BankedPoint[];
  iterations: number;
  banked: number;
}

/** One audited project fed into the Season Index. */
export interface SeasonProject {
  handle: string;
  project: string;
  report: LoopReport;
  timeline: LoopTimeline;
}

/** A neutral, celebration-framed row in the Season Index (PRD §3.5). */
export interface SeasonEntry {
  handle: string;
  project: string;
  score: number;
  coverage: number;
  integrity: number;
  iterations: number;
  banked: number;
  contradicted: number;
  /**
   * `narrative` = nothing machine-checkable (prose log) — a neutral fact, not a
   * failure. `verified`/`audited`/`contested` apply only to machine-checkable logs.
   */
  status: "verified" | "audited" | "contested" | "narrative";
}

/** A clustered failure class across the season (PRD §3.6). */
export interface FailureFingerprint {
  /** The failing check that characterises this class. */
  signature: CheckName;
  /** Total contradicted lines with this signature. */
  count: number;
  /** Distinct projects exhibiting it. */
  projects: number;
}

/** The aggregated Season Index plus season-wide analytics. */
export interface SeasonSummary {
  entries: SeasonEntry[];
  totals: {
    projects: number;
    iterations: number;
    banked: number;
    contradicted: number;
  };
  fingerprints: FailureFingerprint[];
  /** Mean time-to-green across every failure in the season, or null if none. */
  avgTimeToGreenMs: number | null;
  /** Fraction of checkable lines flagged as verdict-mismatch (0–1). */
  verdictMismatchRate: number;
}

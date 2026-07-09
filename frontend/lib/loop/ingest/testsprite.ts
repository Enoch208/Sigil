import type { Run, RunVerdict } from "../types";

/** The shape of a TestSprite run as returned by `testsprite test wait --output json`. */
export interface TestSpriteRun {
  runId: string;
  testId?: string;
  status: string;
  finishedAt?: string;
  stepSummary?: { failedCount?: number };
}

function toVerdict(status: string): RunVerdict {
  if (status === "passed") return "pass";
  if (status === "blocked") return "blocked";
  return "fail"; // failed, cancelled, or anything unexpected
}

/** Map a TestSprite run into the engine's `Run` so the verifier can cross-check it. */
export function mapTestSpriteRun(json: TestSpriteRun): Run {
  return {
    id: json.runId,
    verdict: toVerdict(json.status),
    assertionsPassed: (json.stepSummary?.failedCount ?? 0) === 0,
    timestamp: json.finishedAt ? Date.parse(json.finishedAt) : 0,
    testId: json.testId,
  };
}

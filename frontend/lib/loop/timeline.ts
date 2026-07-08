import type {
  BankedPoint,
  Commit,
  LoopReport,
  LoopTimeline,
  Run,
  TimeToGreen,
  TimelineEvent,
  Verdict,
} from "./types";

/** A line counts as green when it verified (or hit the known verdict-mismatch). */
function isGreen(verdict: Verdict): boolean {
  return verdict === "verified" || verdict === "verdict-mismatch";
}

/**
 * Derive the UI-ready replay view of a finished loop: an ordered rail of events
 * narrated by their LOOP.md lines, time-to-green per failure, and cumulative
 * banked-suite growth (PRD §3.3).
 */
export function buildTimeline(
  report: LoopReport,
  { commits, runs }: { commits: Commit[]; runs: Run[] },
): LoopTimeline {
  const runById = new Map(runs.map((r) => [r.id, r]));
  const commitBySha = new Map(commits.map((c) => [c.sha, c]));

  const events: TimelineEvent[] = report.verdicts.map((v, order) => {
    const { line } = v;
    const timestamp =
      (line.runId ? runById.get(line.runId)?.timestamp : undefined) ??
      (line.commitSha ? commitBySha.get(line.commitSha)?.timestamp : undefined);
    return {
      order,
      iter: line.iter,
      testId: line.testId,
      verdict: v.verdict,
      banked: Boolean(line.banked),
      timestamp,
      commitSha: line.commitSha,
      runId: line.runId,
      narration: line.raw,
    };
  });

  const timeToGreen = computeTimeToGreen(report, runById, runs);

  const bankedEvents = events
    .filter((e) => e.banked && isGreen(e.verdict) && e.timestamp !== undefined)
    .sort((a, b) => a.timestamp! - b.timestamp!);
  const bankedGrowth: BankedPoint[] = bankedEvents.map((e, i) => ({
    at: e.timestamp!,
    banked: i + 1,
  }));

  const banked = events.filter((e) => e.banked && isGreen(e.verdict)).length;

  return {
    events,
    timeToGreen,
    bankedGrowth,
    iterations: events.length,
    banked,
  };
}

function computeTimeToGreen(
  report: LoopReport,
  runById: Map<string, Run>,
  runs: Run[],
): TimeToGreen[] {
  const firstFailByTest = new Map<string, number>();
  for (const r of runs) {
    if (r.verdict === "fail" && r.testId) {
      const prev = firstFailByTest.get(r.testId);
      if (prev === undefined || r.timestamp < prev) firstFailByTest.set(r.testId, r.timestamp);
    }
  }

  const seen = new Set<string>();
  const out: TimeToGreen[] = [];
  for (const v of report.verdicts) {
    const { line } = v;
    if (!line.testId || !line.banked || !isGreen(v.verdict) || seen.has(line.testId)) continue;
    const greenAt = line.runId ? runById.get(line.runId)?.timestamp : undefined;
    const firstFailAt = firstFailByTest.get(line.testId);
    if (greenAt === undefined || firstFailAt === undefined || greenAt < firstFailAt) continue;
    seen.add(line.testId);
    out.push({ testId: line.testId, firstFailAt, greenAt, ms: greenAt - firstFailAt });
  }
  return out;
}

import type {
  CheckName,
  FailureFingerprint,
  SeasonEntry,
  SeasonProject,
  SeasonSummary,
} from "./types";

function statusOf(
  score: number,
  contradicted: number,
  checkable: number,
): SeasonEntry["status"] {
  if (checkable === 0) return "narrative"; // nothing machine-checkable — neutral, not a failure
  if (contradicted > 0) return "contested";
  if (score >= 95) return "verified";
  return "audited";
}

function key(p: { handle: string; project: string }): string {
  return `${p.handle}/${p.project}`;
}

/** Aggregate audited projects into the Season Index plus season-wide analytics. */
export function aggregateSeason(projects: SeasonProject[]): SeasonSummary {
  const entries: SeasonEntry[] = projects
    .map((p) => ({
      handle: p.handle,
      project: p.project,
      score: p.report.score.score,
      coverage: p.report.score.coverage,
      integrity: p.report.score.integrity,
      iterations: p.timeline.iterations,
      banked: p.timeline.banked,
      contradicted: p.report.score.contradicted,
      status: statusOf(
        p.report.score.score,
        p.report.score.contradicted,
        p.report.score.checkable,
      ),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.iterations - a.iterations ||
        key(a).localeCompare(key(b)),
    );

  const clusters = new Map<CheckName, { count: number; projects: Set<string> }>();
  for (const p of projects) {
    for (const verdict of p.report.verdicts) {
      if (verdict.verdict !== "contradicted") continue;
      const failing = verdict.checks.find((c) => c.status === "fail");
      if (!failing) continue;
      const cluster = clusters.get(failing.check) ?? { count: 0, projects: new Set() };
      cluster.count++;
      cluster.projects.add(key(p));
      clusters.set(failing.check, cluster);
    }
  }
  const fingerprints: FailureFingerprint[] = [...clusters.entries()]
    .map(([signature, c]) => ({ signature, count: c.count, projects: c.projects.size }))
    .sort((a, b) => b.count - a.count || a.signature.localeCompare(b.signature));

  const msSamples = projects.flatMap((p) => p.timeline.timeToGreen.map((t) => t.ms));
  const avgTimeToGreenMs =
    msSamples.length === 0
      ? null
      : Math.round(msSamples.reduce((sum, ms) => sum + ms, 0) / msSamples.length);

  let mismatch = 0;
  let checkable = 0;
  for (const p of projects) {
    mismatch += p.report.score.verdictMismatch;
    checkable += p.report.score.checkable;
  }
  const verdictMismatchRate = checkable === 0 ? 0 : mismatch / checkable;

  return {
    entries,
    totals: {
      projects: projects.length,
      iterations: projects.reduce((s, p) => s + p.timeline.iterations, 0),
      banked: projects.reduce((s, p) => s + p.timeline.banked, 0),
      contradicted: projects.reduce((s, p) => s + p.report.score.contradicted, 0),
    },
    fingerprints,
    avgTimeToGreenMs,
    verdictMismatchRate,
  };
}

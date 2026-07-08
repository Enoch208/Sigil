import type { Commit, LoopReport, LoopTimeline, Run } from "./types";
import { parseLoopMd } from "./parser";
import { verifyLoop } from "./verifier";
import { buildTimeline } from "./timeline";

export interface AuditInput {
  loopMarkdown: string;
  commits: Commit[];
  runs: Run[];
  /** Which sources were ingested; an unavailable source stays neutral, not contradicted. */
  available?: { commits?: boolean; runs?: boolean };
}

export interface AuditResult {
  report: LoopReport;
  timeline: LoopTimeline;
}

/** Run the full pipeline for one project: parse LOOP.md, verify, derive timeline. */
export function audit({ loopMarkdown, commits, runs, available }: AuditInput): AuditResult {
  const { lines } = parseLoopMd(loopMarkdown);
  const report = verifyLoop({ lines, commits, runs, available });
  const timeline = buildTimeline(report, { commits, runs });
  return { report, timeline };
}

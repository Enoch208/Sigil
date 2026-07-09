import type { ClaimedVerdict, LoopLine, ParseFlag, ParsedLoop } from "./types";

const MAKER = /\[maker=([^\]]+)\]/i;
const ITER = /\[iter=([^\]]+)\]/i;
const TEST_ID = /\bTC-[A-Za-z]+-\d+\b/;
const VERDICT = /\bPASS\b|\bFAIL\b|[✅❌]/gi;
const DESC_STRAIGHT = /"([^"]*)"/;
const DESC_SMART = /[“]([^”]*)[”]/;
const COMMIT = /\bcommit\s+([0-9a-f]{6,40})\b/i;
const RUN = /\brun\s+([A-Za-z0-9_-]+)/i;
const BANKED = /\bbanked\b/i;
const ANCHOR_GROUP = /\[[^\]]*\]/g;
const FENCE = /^```/;

/** A line is worth parsing if it carries any loop-line signal. */
function isCandidate(line: string): boolean {
  return (
    MAKER.test(line) ||
    ITER.test(line) ||
    TEST_ID.test(line) ||
    /\b(PASS|FAIL)\b/i.test(line) ||
    /[✅❌]/.test(line)
  );
}

function lastVerdict(line: string): ClaimedVerdict | undefined {
  const matches = line.match(VERDICT);
  if (!matches || matches.length === 0) return undefined;
  const last = matches[matches.length - 1].toUpperCase();
  return last === "PASS" || last === "✅" ? "pass" : "fail";
}

function parseLine(raw: string, sourceLineNo: number): LoopLine {
  const flags: ParseFlag[] = [];

  const makerMatch = raw.match(MAKER);
  const maker = makerMatch?.[1].trim();
  if (!maker) flags.push("missing-maker");

  const iterMatch = raw.match(ITER);
  let iter: number | undefined;
  if (!iterMatch) {
    flags.push("missing-iter");
  } else if (/^\d+$/.test(iterMatch[1].trim())) {
    iter = parseInt(iterMatch[1].trim(), 10);
  } else {
    flags.push("malformed-iter");
  }

  const testId = raw.match(TEST_ID)?.[0].toUpperCase();
  if (!testId) flags.push("missing-test-id");

  const description = (raw.match(DESC_STRAIGHT) ?? raw.match(DESC_SMART))?.[1];

  const claimedVerdict = lastVerdict(raw);
  if (!claimedVerdict) flags.push("no-verdict");

  const banked = BANKED.test(raw) || undefined;
  // Anchors live only inside the trailing [commit … · run …] bracket group.
  // Restricting extraction to brackets prevents the English words "commit"/"run"
  // in prose logs from being misread as claims (which would fabricate contradictions).
  const anchorText = (raw.match(ANCHOR_GROUP) ?? []).join(" ");
  const commitSha = anchorText.match(COMMIT)?.[1].toLowerCase();
  const runId = anchorText.match(RUN)?.[1];
  if (!commitSha && !runId) flags.push("no-anchors");

  return {
    raw,
    sourceLineNo,
    maker,
    iter,
    testId,
    description,
    claimedVerdict,
    commitSha,
    runId,
    banked,
    parseFlags: flags,
  };
}

/**
 * Parse a LOOP.md document into structured lines. Tolerant by design:
 * skips fenced code and prose, extracts what it can from loose lines,
 * flags gaps, and never throws.
 */
export function parseLoopMd(raw: string): ParsedLoop {
  const lines: LoopLine[] = [];
  let ignored = 0;
  let inFence = false;

  const rawLines = raw.split(/\r?\n/);
  for (let i = 0; i < rawLines.length; i++) {
    const text = rawLines[i];
    const trimmed = text.trim();

    if (FENCE.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (trimmed === "") continue;
    if (inFence || !isCandidate(text)) {
      ignored++;
      continue;
    }

    lines.push(parseLine(text, i + 1));
  }

  flagDuplicateIters(lines);

  return { lines, totalLines: lines.length, ignored };
}

function flagDuplicateIters(lines: LoopLine[]): void {
  const counts = new Map<number, number>();
  for (const line of lines) {
    if (line.iter !== undefined) {
      counts.set(line.iter, (counts.get(line.iter) ?? 0) + 1);
    }
  }
  for (const line of lines) {
    if (line.iter !== undefined && (counts.get(line.iter) ?? 0) > 1) {
      line.parseFlags.push("duplicate-iter");
    }
  }
}

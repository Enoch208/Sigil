import type {
  CheckResult,
  ClaimedVerdict,
  Commit,
  LineVerdict,
  LoopLine,
  LoopReport,
  Run,
  Verdict,
  VerifyInput,
} from "./types";
import { scoreLoop } from "./scoring";

/** A run counts as passing if it passed, or was blocked but every assertion passed. */
function isPassingRun(run: Run): boolean {
  return run.verdict === "pass" || (run.verdict === "blocked" && run.assertionsPassed);
}

type VerdictMatch = "ok" | "mismatch" | "bad";

/** Compare a line's claimed verdict against the recorded run verdict. */
function matchVerdict(claimed: ClaimedVerdict, run: Run): VerdictMatch {
  if (claimed === "pass") {
    if (run.verdict === "pass") return "ok";
    if (run.verdict === "blocked" && run.assertionsPassed) return "mismatch";
    return "bad";
  }
  return run.verdict === "fail" ? "ok" : "bad";
}

interface OrderState {
  maxCommitTs: number;
}

function verifyLine(
  line: LoopLine,
  findCommit: (sha: string) => Commit | undefined,
  runById: Map<string, Run>,
  runsByTest: Map<string, Run[]>,
  order: OrderState,
  available: { commits: boolean; runs: boolean },
): LineVerdict {
  const checks: CheckResult[] = [];
  const reasons: string[] = [];

  const checkableSha = Boolean(line.commitSha) && available.commits;
  const checkableRun = Boolean(line.runId) && available.runs;

  if (!checkableSha && !checkableRun) {
    reasons.push(
      line.commitSha || line.runId
        ? "Anchored, but the referenced source was not ingested."
        : "No machine-checkable anchors (no commit SHA or run ID).",
    );
    return { line, verdict: "unverifiable", checks, reasons };
  }

  let contradicted = false;
  let mismatch = false;

  let commit: Commit | undefined;
  if (checkableSha) {
    commit = findCommit(line.commitSha!);
    if (!commit) {
      checks.push({ check: "sha-exists", status: "fail", detail: `commit ${line.commitSha} not found in git history` });
      reasons.push(`Claimed commit ${line.commitSha} does not exist.`);
      contradicted = true;
    } else {
      checks.push({ check: "sha-exists", status: "pass" });
      if (commit.timestamp < order.maxCommitTs) {
        checks.push({ check: "sha-order", status: "fail", detail: "commit predates an earlier line's commit" });
        reasons.push("Commit lands out of chronological order.");
        contradicted = true;
      } else {
        checks.push({ check: "sha-order", status: "pass" });
      }
      order.maxCommitTs = Math.max(order.maxCommitTs, commit.timestamp);
    }
  }

  let run: Run | undefined;
  if (checkableRun) {
    run = runById.get(line.runId!);
    if (!run) {
      checks.push({ check: "run-exists", status: "fail", detail: `run ${line.runId} not found` });
      reasons.push(`Claimed run ${line.runId} does not exist.`);
      contradicted = true;
    } else {
      checks.push({ check: "run-exists", status: "pass" });
      if (line.claimedVerdict) {
        const match = matchVerdict(line.claimedVerdict, run);
        if (match === "ok") {
          checks.push({ check: "run-verdict", status: "pass" });
        } else if (match === "mismatch") {
          checks.push({ check: "run-verdict", status: "pass", detail: "blocked verdict with passing assertions — known checker issue" });
          reasons.push("Run reported 'blocked' while every assertion passed (verdict mismatch, not a failure).");
          mismatch = true;
        } else {
          checks.push({ check: "run-verdict", status: "fail", detail: `run verdict '${run.verdict}' contradicts claimed '${line.claimedVerdict}'` });
          reasons.push(`Run verdict '${run.verdict}' contradicts the claimed '${line.claimedVerdict}'.`);
          contradicted = true;
        }
      } else {
        checks.push({ check: "run-verdict", status: "skipped", detail: "line has no claimed verdict" });
      }
    }
  }

  if (commit && run) {
    const failRunTs = latestFailBefore(runsByTest.get(line.testId ?? ""), run.timestamp);
    const lo = failRunTs ?? Number.NEGATIVE_INFINITY;
    if (commit.timestamp >= lo && commit.timestamp <= run.timestamp) {
      checks.push({ check: "timestamp-coherence", status: "pass" });
    } else {
      checks.push({ check: "timestamp-coherence", status: "fail", detail: "fix commit does not sit between the FAIL and PASS runs" });
      reasons.push("Fix commit timestamp is incoherent with its runs.");
      contradicted = true;
    }
  }

  if (run && line.banked && line.claimedVerdict === "pass" && line.testId) {
    const later = (runsByTest.get(line.testId) ?? []).filter((r) => r.timestamp > run!.timestamp);
    if (later.length === 0) {
      checks.push({ check: "banked-pass", status: "skipped", detail: "no later runs to confirm banking" });
    } else if (later.some((r) => !isPassingRun(r))) {
      checks.push({ check: "banked-pass", status: "fail", detail: "a later run for this test failed — pass did not bank" });
      reasons.push("A later run regressed; the claimed pass did not bank.");
      contradicted = true;
    } else {
      checks.push({ check: "banked-pass", status: "pass" });
    }
  }

  const verdict = resolveVerdict(contradicted, mismatch, checks);
  return { line, verdict, checks, reasons };
}

function resolveVerdict(contradicted: boolean, mismatch: boolean, checks: CheckResult[]): Verdict {
  if (contradicted) return "contradicted";
  if (mismatch) return "verdict-mismatch";
  if (checks.some((c) => c.status === "pass")) return "verified";
  return "unverifiable";
}

/** Timestamp of the latest failing run for a test at or before `before`, if any. */
function latestFailBefore(runs: Run[] | undefined, before: number): number | undefined {
  if (!runs) return undefined;
  let ts: number | undefined;
  for (const r of runs) {
    if (r.verdict === "fail" && r.timestamp <= before) {
      if (ts === undefined || r.timestamp > ts) ts = r.timestamp;
    }
  }
  return ts;
}

/** Cross-check every parsed line against git commits and run history. */
export function verifyLoop({ lines, commits, runs, available }: VerifyInput): LoopReport {
  const availability = {
    commits: available?.commits ?? true,
    runs: available?.runs ?? true,
  };
  const commitBySha = new Map(commits.map((c) => [c.sha, c]));
  // Real LOOP.md lines carry short (7-char) SHAs; the GitHub API returns full
  // (40-char) SHAs. Match exact first, then by prefix in either direction.
  const findCommit = (sha: string): Commit | undefined =>
    commitBySha.get(sha) ??
    commits.find((c) => c.sha.startsWith(sha) || sha.startsWith(c.sha));
  const runById = new Map(runs.map((r) => [r.id, r]));
  const runsByTest = new Map<string, Run[]>();
  for (const r of runs) {
    if (r.testId) {
      const list = runsByTest.get(r.testId) ?? [];
      list.push(r);
      runsByTest.set(r.testId, list);
    }
  }

  const order: OrderState = { maxCommitTs: Number.NEGATIVE_INFINITY };
  const verdicts = lines.map((line) =>
    verifyLine(line, findCommit, runById, runsByTest, order, availability),
  );

  return { verdicts, score: scoreLoop(verdicts) };
}

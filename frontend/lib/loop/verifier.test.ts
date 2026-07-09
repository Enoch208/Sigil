import { describe, it, expect } from "vitest";
import { verifyLoop } from "./verifier";
import type { CheckName, Commit, LoopLine, Run } from "./types";

function line(o: Partial<LoopLine> = {}): LoopLine {
  return { raw: "synthetic", sourceLineNo: 1, parseFlags: [], ...o };
}

function checkStatus(
  checks: { check: CheckName; status: string }[],
  name: CheckName,
) {
  return checks.find((c) => c.check === name)?.status;
}

describe("verifyLoop — happy path (TC-VERIFY-01)", () => {
  it("marks a line verified when its SHA and run both check out", () => {
    const lines = [
      line({
        iter: 1,
        testId: "TC-A-01",
        claimedVerdict: "pass",
        commitSha: "abc1234",
        runId: "r_1",
        banked: true,
      }),
    ];
    const commits: Commit[] = [{ sha: "abc1234", timestamp: 1000 }];
    const runs: Run[] = [
      { id: "r_1", verdict: "pass", assertionsPassed: true, timestamp: 1100, testId: "TC-A-01" },
    ];

    const { verdicts } = verifyLoop({ lines, commits, runs });
    expect(verdicts[0].verdict).toBe("verified");
    expect(checkStatus(verdicts[0].checks, "sha-exists")).toBe("pass");
    expect(checkStatus(verdicts[0].checks, "run-verdict")).toBe("pass");
  });
});

describe("verifyLoop — SHA checks (TC-VERIFY-02,03)", () => {
  it("contradicts a line whose claimed SHA does not exist", () => {
    const lines = [line({ iter: 1, commitSha: "deadbee", claimedVerdict: "pass" })];
    const { verdicts } = verifyLoop({ lines, commits: [], runs: [] });
    expect(verdicts[0].verdict).toBe("contradicted");
    expect(checkStatus(verdicts[0].checks, "sha-exists")).toBe("fail");
  });

  it("contradicts a commit that lands out of chronological order", () => {
    const lines = [
      line({ iter: 1, commitSha: "c1", claimedVerdict: "pass", sourceLineNo: 1 }),
      line({ iter: 2, commitSha: "c2", claimedVerdict: "pass", sourceLineNo: 2 }),
    ];
    const commits: Commit[] = [
      { sha: "c1", timestamp: 200 },
      { sha: "c2", timestamp: 100 },
    ];
    const { verdicts } = verifyLoop({ lines, commits, runs: [] });
    expect(verdicts[0].verdict).toBe("verified");
    expect(verdicts[1].verdict).toBe("contradicted");
    expect(checkStatus(verdicts[1].checks, "sha-order")).toBe("fail");
  });
});

describe("verifyLoop — run checks (TC-VERIFY-04,05)", () => {
  it("contradicts a claimed PASS whose run actually failed", () => {
    const lines = [line({ testId: "TC-A-01", claimedVerdict: "pass", runId: "r_1" })];
    const runs: Run[] = [
      { id: "r_1", verdict: "fail", assertionsPassed: false, timestamp: 100, testId: "TC-A-01" },
    ];
    const { verdicts } = verifyLoop({ lines, commits: [], runs });
    expect(verdicts[0].verdict).toBe("contradicted");
    expect(checkStatus(verdicts[0].checks, "run-verdict")).toBe("fail");
  });

  it("contradicts a line whose run id does not exist", () => {
    const lines = [line({ claimedVerdict: "pass", runId: "r_missing" })];
    const { verdicts } = verifyLoop({ lines, commits: [], runs: [] });
    expect(verdicts[0].verdict).toBe("contradicted");
    expect(checkStatus(verdicts[0].checks, "run-exists")).toBe("fail");
  });
});

describe("verifyLoop — blocked-with-passing-assertions (TC-VERIFY-10, PRD §3.2)", () => {
  it("classifies blocked-but-all-assertions-passed as verdict-mismatch, not a failure", () => {
    const lines = [line({ testId: "TC-A-01", claimedVerdict: "pass", runId: "r_b" })];
    const runs: Run[] = [
      { id: "r_b", verdict: "blocked", assertionsPassed: true, timestamp: 100, testId: "TC-A-01" },
    ];
    const { verdicts } = verifyLoop({ lines, commits: [], runs });
    expect(verdicts[0].verdict).toBe("verdict-mismatch");
  });

  it("still contradicts a blocked run whose assertions genuinely failed", () => {
    const lines = [line({ testId: "TC-A-01", claimedVerdict: "pass", runId: "r_b" })];
    const runs: Run[] = [
      { id: "r_b", verdict: "blocked", assertionsPassed: false, timestamp: 100, testId: "TC-A-01" },
    ];
    const { verdicts } = verifyLoop({ lines, commits: [], runs });
    expect(verdicts[0].verdict).toBe("contradicted");
  });
});

describe("verifyLoop — unverifiable (TC-VERIFY-08)", () => {
  it("marks a line with no anchors as unverifiable and runs no checks", () => {
    const lines = [line({ claimedVerdict: "pass", parseFlags: ["no-anchors"] })];
    const { verdicts } = verifyLoop({ lines, commits: [], runs: [] });
    expect(verdicts[0].verdict).toBe("unverifiable");
    expect(verdicts[0].checks).toHaveLength(0);
  });
});

describe("verifyLoop — timestamp coherence (TC-VERIFY-06)", () => {
  it("contradicts a fix commit that lands after the passing run", () => {
    const lines = [
      line({ testId: "TC-A-01", claimedVerdict: "pass", commitSha: "c1", runId: "r_1" }),
    ];
    const commits: Commit[] = [{ sha: "c1", timestamp: 2000 }];
    const runs: Run[] = [
      { id: "r_1", verdict: "pass", assertionsPassed: true, timestamp: 1000, testId: "TC-A-01" },
    ];
    const { verdicts } = verifyLoop({ lines, commits, runs });
    expect(verdicts[0].verdict).toBe("contradicted");
    expect(checkStatus(verdicts[0].checks, "timestamp-coherence")).toBe("fail");
  });
});

describe("verifyLoop — short/full SHA matching (real LOOP.md vs GitHub API)", () => {
  it("matches a 7-char LOOP.md SHA against a full 40-char git SHA", () => {
    const lines = [line({ iter: 1, commitSha: "ab3f2e1", claimedVerdict: "pass" })];
    const commits: Commit[] = [
      { sha: "ab3f2e1c0ffee1234567890abcdef1234567890ab", timestamp: 1000 },
    ];
    const { verdicts } = verifyLoop({ lines, commits, runs: [] });
    expect(verdicts[0].verdict).toBe("verified");
    expect(checkStatus(verdicts[0].checks, "sha-exists")).toBe("pass");
  });

  it("still contradicts a short SHA that prefixes nothing in history", () => {
    const lines = [line({ iter: 1, commitSha: "deadbee", claimedVerdict: "pass" })];
    const commits: Commit[] = [
      { sha: "ab3f2e1c0ffee1234567890abcdef1234567890ab", timestamp: 1000 },
    ];
    const { verdicts } = verifyLoop({ lines, commits, runs: [] });
    expect(verdicts[0].verdict).toBe("contradicted");
  });
});

describe("verifyLoop — duplicate run id (fabrication signal)", () => {
  it("contradicts two lines that claim the same run id", () => {
    const lines = [
      line({ iter: 1, testId: "TC-A-01", claimedVerdict: "pass", runId: "r_dup" }),
      line({ iter: 2, testId: "TC-A-02", claimedVerdict: "pass", runId: "r_dup" }),
    ];
    const runs: Run[] = [
      { id: "r_dup", verdict: "pass", assertionsPassed: true, timestamp: 100, testId: "TC-A-01" },
    ];
    const { verdicts } = verifyLoop({ lines, commits: [], runs });
    expect(verdicts[0].verdict).toBe("contradicted");
    expect(verdicts[1].verdict).toBe("contradicted");
    expect(checkStatus(verdicts[0].checks, "run-unique")).toBe("fail");
  });

  it("leaves a uniquely-used run id alone", () => {
    const lines = [line({ testId: "TC-A-01", claimedVerdict: "pass", runId: "r_uniq" })];
    const runs: Run[] = [
      { id: "r_uniq", verdict: "pass", assertionsPassed: true, timestamp: 100, testId: "TC-A-01" },
    ];
    const { verdicts } = verifyLoop({ lines, commits: [], runs });
    expect(verdicts[0].verdict).toBe("verified");
  });
});

describe("verifyLoop — partial source availability", () => {
  it("marks a run-anchored line unverifiable (not contradicted) when runs were not ingested", () => {
    const lines = [line({ testId: "TC-A-01", claimedVerdict: "pass", runId: "r_1" })];
    const { verdicts } = verifyLoop({
      lines,
      commits: [],
      runs: [],
      available: { commits: true, runs: false },
    });
    expect(verdicts[0].verdict).toBe("unverifiable");
  });

  it("still verifies a commit-anchored line when only runs are unavailable", () => {
    const lines = [line({ iter: 1, commitSha: "c1", claimedVerdict: "pass" })];
    const commits: Commit[] = [{ sha: "c1", timestamp: 100 }];
    const { verdicts } = verifyLoop({
      lines,
      commits,
      runs: [],
      available: { commits: true, runs: false },
    });
    expect(verdicts[0].verdict).toBe("verified");
  });

  it("marks a commit-anchored line unverifiable when commits were not ingested", () => {
    const lines = [line({ iter: 1, commitSha: "c1", claimedVerdict: "pass" })];
    const { verdicts } = verifyLoop({
      lines,
      commits: [],
      runs: [],
      available: { commits: false, runs: true },
    });
    expect(verdicts[0].verdict).toBe("unverifiable");
  });
});

describe("verifyLoop — banked-pass confirmation (TC-VERIFY-07)", () => {
  it("contradicts a banked PASS that a later run for the same test refutes", () => {
    const lines = [
      line({ testId: "TC-A-01", claimedVerdict: "pass", runId: "r_pass", banked: true }),
    ];
    const runs: Run[] = [
      { id: "r_pass", verdict: "pass", assertionsPassed: true, timestamp: 1000, testId: "TC-A-01" },
      { id: "r_later", verdict: "fail", assertionsPassed: false, timestamp: 2000, testId: "TC-A-01" },
    ];
    const { verdicts } = verifyLoop({ lines, commits: [], runs });
    expect(verdicts[0].verdict).toBe("contradicted");
    expect(checkStatus(verdicts[0].checks, "banked-pass")).toBe("fail");
  });
});

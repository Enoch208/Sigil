import type { Commit, Run } from "../types";

/**
 * A clean, internally consistent loop: three fail→fix→pass iterations whose
 * commits and runs all cohere. Verifies to integrity 100 / score 100 with zero
 * contradictions — the PRD's "our own log ≥95" property, provable in a test.
 */
export const CLEAN_LOOP_MD = [
  '[maker=claude-code] [iter=1] TC-PARSE-01 "canonical line parses" → FAIL (red) → fixed parser → PASS banked [commit aaa1111 · run r_p1]',
  '[maker=claude-code] [iter=2] TC-VERIFY-04 "verifier cross-checks sources" → FAIL (red) → fixed verifier → PASS banked [commit bbb2222 · run r_p2]',
  '[maker=claude-code] [iter=3] TC-SCORE-01 "scoring matches methodology" → FAIL (red) → fixed scoring → PASS banked [commit ccc3333 · run r_p3]',
].join("\n");

export const CLEAN_COMMITS: Commit[] = [
  { sha: "aaa1111", timestamp: 1000, message: "fix parser" },
  { sha: "bbb2222", timestamp: 2000, message: "fix verifier" },
  { sha: "ccc3333", timestamp: 3000, message: "fix scoring" },
];

export const CLEAN_RUNS: Run[] = [
  { id: "r_f1", verdict: "fail", assertionsPassed: false, timestamp: 500, testId: "TC-PARSE-01" },
  { id: "r_p1", verdict: "pass", assertionsPassed: true, timestamp: 1500, testId: "TC-PARSE-01" },
  { id: "r_f2", verdict: "fail", assertionsPassed: false, timestamp: 1500, testId: "TC-VERIFY-04" },
  { id: "r_p2", verdict: "pass", assertionsPassed: true, timestamp: 2500, testId: "TC-VERIFY-04" },
  { id: "r_f3", verdict: "fail", assertionsPassed: false, timestamp: 2500, testId: "TC-SCORE-01" },
  { id: "r_p3", verdict: "pass", assertionsPassed: true, timestamp: 3500, testId: "TC-SCORE-01" },
];

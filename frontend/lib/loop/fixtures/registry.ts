import type { AuditInput } from "../audit";
import { CLEAN_LOOP_MD, CLEAN_COMMITS, CLEAN_RUNS } from "./clean";

/** A second demo whose second line claims PASS but whose run actually failed. */
const AUTHFLOW: AuditInput = {
  loopMarkdown: [
    '[maker=nexus] [iter=1] TC-AUTH-01 "oauth happy path" → FAIL → fixed → PASS banked [commit e1e1e1e · run r_a1]',
    '[maker=nexus] [iter=2] TC-AUTH-02 "denied path banks" → FAIL → fixed → PASS banked [commit e2e2e2e · run r_a2]',
  ].join("\n"),
  commits: [
    { sha: "e1e1e1e", timestamp: 1000, message: "auth happy path" },
    { sha: "e2e2e2e", timestamp: 2000, message: "auth denied path" },
  ],
  runs: [
    { id: "r_a1", verdict: "pass", assertionsPassed: true, timestamp: 1500, testId: "TC-AUTH-01" },
    { id: "r_a2", verdict: "fail", assertionsPassed: false, timestamp: 2500, testId: "TC-AUTH-02" },
  ],
};

/**
 * A small in-memory registry of demo projects so the API routes are hittable
 * before real ingestion exists. Keyed by `handle/project` (case-insensitive).
 * Swaps for a real data source (Neon-backed) later without route changes.
 */
const REGISTRY: Record<string, AuditInput> = {
  "loopscope/sigil": {
    loopMarkdown: CLEAN_LOOP_MD,
    commits: CLEAN_COMMITS,
    runs: CLEAN_RUNS,
  },
  // Same log with one commit SHA tampered — verifies to a contradiction.
  "loopscope/contested": {
    loopMarkdown: CLEAN_LOOP_MD.replace("bbb2222", "deadbee"),
    commits: CLEAN_COMMITS,
    runs: CLEAN_RUNS,
  },
  "nexus/authflow": AUTHFLOW,
};

export interface RegisteredProject {
  handle: string;
  project: string;
  sources: AuditInput;
}

export function getProjectSources(handle: string, project: string): AuditInput | null {
  return REGISTRY[`${handle.toLowerCase()}/${project.toLowerCase()}`] ?? null;
}

export function listProjects(): RegisteredProject[] {
  return Object.entries(REGISTRY).map(([id, sources]) => {
    const [handle, project] = id.split("/");
    return { handle, project, sources };
  });
}

import type { Commit, Run } from "./types";

/**
 * Ingestion boundaries. The core engine is pure and depends only on these
 * interfaces; real adapters (GitHub API, TestSprite platform / CLI JSON
 * fallback, Neon-backed stores) implement them without the engine changing.
 */

export interface LoopSource {
  /** Raw LOOP.md contents for the project under audit. */
  loopMarkdown(): Promise<string>;
}

export interface GitSource {
  /** Commits for the repo/branch under audit, in any order. */
  commits(): Promise<Commit[]>;
}

export interface RunSource {
  /** Known TestSprite runs for the linked project. */
  runs(): Promise<Run[]>;
}

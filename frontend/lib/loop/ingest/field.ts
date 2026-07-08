import type { Commit, SeasonProject } from "../types";
import { audit } from "../audit";
import { GitHubSource } from "./github";

export interface FieldRepo {
  handle: string;
  project: string;
  owner: string;
  repo: string;
  ref?: string;
  loopPath?: string;
  token?: string;
}

export interface FieldSource {
  loopMarkdown(): Promise<string>;
  commits(): Promise<Commit[]>;
}

export type SourceFactory = (repo: FieldRepo) => FieldSource;

const githubFactory: SourceFactory = (r) =>
  new GitHubSource({ owner: r.owner, repo: r.repo, ref: r.ref, loopPath: r.loopPath, token: r.token });

/**
 * Ingest a set of repos into scored SeasonProjects. Git is available but
 * TestSprite runs are not (marked unavailable → run-anchored lines stay neutral).
 * A repo that fails to fetch is skipped, never fatal to the batch.
 */
export async function ingestField(
  repos: FieldRepo[],
  createSource: SourceFactory = githubFactory,
): Promise<SeasonProject[]> {
  const results = await Promise.all(
    repos.map(async (r): Promise<SeasonProject | null> => {
      try {
        const src = createSource(r);
        const [loopMarkdown, commits] = await Promise.all([src.loopMarkdown(), src.commits()]);
        const { report, timeline } = audit({
          loopMarkdown,
          commits,
          runs: [],
          available: { commits: true, runs: false },
        });
        return { handle: r.handle, project: r.project, report, timeline };
      } catch {
        return null;
      }
    }),
  );
  return results.filter((p): p is SeasonProject => p !== null);
}

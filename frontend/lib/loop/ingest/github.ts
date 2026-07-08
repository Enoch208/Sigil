import type { Commit } from "../types";
import type { GitSource, LoopSource } from "../sources";

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

/** Map a GitHub `GET /repos/:o/:r/commits` payload to our Commit[]; skips malformed entries. */
export function mapGitHubCommits(payload: unknown): Commit[] {
  if (!Array.isArray(payload)) return [];
  const out: Commit[] = [];
  for (const raw of payload) {
    const item = asRecord(raw);
    const commit = asRecord(item?.commit);
    const sha = item?.sha;
    if (typeof sha !== "string" || !commit) continue;
    const dateStr = asRecord(commit.committer)?.date ?? asRecord(commit.author)?.date;
    if (typeof dateStr !== "string") continue;
    const timestamp = Date.parse(dateStr);
    if (Number.isNaN(timestamp)) continue;
    out.push({
      sha,
      timestamp,
      message: typeof commit.message === "string" ? commit.message : undefined,
    });
  }
  return out;
}

/** Decode a GitHub `GET /repos/:o/:r/contents/:path` file response to text; null if not a base64 file. */
export function decodeGitHubContents(payload: unknown): string | null {
  const item = asRecord(payload);
  if (
    !item ||
    item.type !== "file" ||
    item.encoding !== "base64" ||
    typeof item.content !== "string"
  ) {
    return null;
  }
  return Buffer.from(item.content, "base64").toString("utf8");
}

export interface GitHubRepoRef {
  owner: string;
  repo: string;
  /** Branch, tag, or SHA. Defaults to the repo's default branch. */
  ref?: string;
  /** Path to the loop log. Defaults to LOOP.md. */
  loopPath?: string;
  /** PAT; falls back to GITHUB_TOKEN. Optional for public repos. */
  token?: string;
}

/** Reads a public (or token-authorized) GitHub repo's commits and LOOP.md via the REST API. */
export class GitHubSource implements GitSource, LoopSource {
  constructor(private readonly repo: GitHubRepoRef) {}

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "loopscope",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    const token = this.repo.token ?? process.env.GITHUB_TOKEN;
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  async commits(): Promise<Commit[]> {
    const { owner, repo, ref } = this.repo;
    const perPage = 100;
    const maxPages = 20; // up to 2000 commits — generous; guards against runaway repos
    const all: Commit[] = [];
    for (let page = 1; page <= maxPages; page++) {
      const url = new URL(`https://api.github.com/repos/${owner}/${repo}/commits`);
      url.searchParams.set("per_page", String(perPage));
      url.searchParams.set("page", String(page));
      if (ref) url.searchParams.set("sha", ref);
      const res = await fetch(url, { headers: this.headers() });
      if (!res.ok) throw new Error(`GitHub commits ${res.status} for ${owner}/${repo}`);
      const json = await res.json();
      all.push(...mapGitHubCommits(json));
      if (!Array.isArray(json) || json.length < perPage) break;
    }
    return all;
  }

  async loopMarkdown(): Promise<string> {
    const { owner, repo, ref, loopPath = "LOOP.md" } = this.repo;
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/contents/${loopPath}`);
    if (ref) url.searchParams.set("ref", ref);
    const res = await fetch(url, { headers: this.headers() });
    if (res.status === 404) return "";
    if (!res.ok) throw new Error(`GitHub contents ${res.status} for ${owner}/${repo}/${loopPath}`);
    return decodeGitHubContents(await res.json()) ?? "";
  }
}

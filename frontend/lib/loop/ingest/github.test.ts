import { describe, it, expect, vi, afterEach } from "vitest";
import { mapGitHubCommits, decodeGitHubContents, GitHubSource } from "./github";

describe("mapGitHubCommits", () => {
  it("maps sha, message and timestamp, preferring the committer date", () => {
    const payload = [
      {
        sha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        commit: {
          message: "fix parser",
          author: { date: "2024-01-01T00:00:00Z" },
          committer: { date: "2024-01-02T00:00:00Z" },
        },
      },
    ];
    const [commit] = mapGitHubCommits(payload);
    expect(commit.sha).toBe("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    expect(commit.message).toBe("fix parser");
    expect(commit.timestamp).toBe(Date.parse("2024-01-02T00:00:00Z"));
  });

  it("skips malformed entries instead of throwing", () => {
    const payload = [
      { sha: "bbbb", commit: { message: "ok", committer: { date: "2024-01-03T00:00:00Z" } } },
      { nope: true },
      null,
    ];
    const commits = mapGitHubCommits(payload);
    expect(commits).toHaveLength(1);
    expect(commits[0].sha).toBe("bbbb");
  });

  it("returns an empty array for a non-array payload", () => {
    expect(mapGitHubCommits({ message: "not a list" })).toEqual([]);
  });
});

describe("decodeGitHubContents", () => {
  it("decodes a base64 file response to text", () => {
    const content = Buffer.from("hello loop\nline two", "utf8").toString("base64");
    expect(decodeGitHubContents({ type: "file", encoding: "base64", content })).toBe(
      "hello loop\nline two",
    );
  });

  it("returns null when the path is not a base64 file", () => {
    expect(decodeGitHubContents([{ name: "a" }])).toBeNull();
    expect(decodeGitHubContents({ type: "dir" })).toBeNull();
  });
});

describe("GitHubSource (network wiring, fetch stubbed)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("fetches and maps commits from the API", async () => {
    vi.stubGlobal(
      "fetch",
      async () =>
        new Response(
          JSON.stringify([
            { sha: "abc123", commit: { message: "m", committer: { date: "2024-01-01T00:00:00Z" } } },
          ]),
          { status: 200 },
        ),
    );
    const commits = await new GitHubSource({ owner: "o", repo: "r" }).commits();
    expect(commits).toEqual([
      { sha: "abc123", timestamp: Date.parse("2024-01-01T00:00:00Z"), message: "m" },
    ]);
  });

  it("decodes the LOOP.md contents response", async () => {
    const content = Buffer.from("loop line", "utf8").toString("base64");
    vi.stubGlobal(
      "fetch",
      async () =>
        new Response(JSON.stringify({ type: "file", encoding: "base64", content }), { status: 200 }),
    );
    expect(await new GitHubSource({ owner: "o", repo: "r" }).loopMarkdown()).toBe("loop line");
  });

  it("treats a missing LOOP.md (404) as an empty log", async () => {
    vi.stubGlobal("fetch", async () => new Response("not found", { status: 404 }));
    expect(await new GitHubSource({ owner: "o", repo: "r" }).loopMarkdown()).toBe("");
  });

  it("throws with the status on a non-ok commits response", async () => {
    vi.stubGlobal("fetch", async () => new Response("boom", { status: 500 }));
    await expect(new GitHubSource({ owner: "o", repo: "r" }).commits()).rejects.toThrow("500");
  });
});

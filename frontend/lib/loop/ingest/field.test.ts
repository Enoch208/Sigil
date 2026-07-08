import { describe, it, expect } from "vitest";
import { ingestField } from "./field";
import { aggregateSeason } from "../season";
import type { Commit } from "../types";

const MACHINE = '[maker=x] [iter=1] TC-A-01 "canonical" → PASS banked [commit abc1234]';
const PROSE = "We ran the suite and everything is PASS; see commit history for details.";

describe("ingestField", () => {
  it("ingests repos into scored SeasonProjects via an injected source", async () => {
    const projects = await ingestField(
      [
        { handle: "a", project: "clean", owner: "o", repo: "clean" },
        { handle: "b", project: "prose", owner: "o", repo: "prose" },
      ],
      (r) =>
        r.repo === "clean"
          ? {
              loopMarkdown: async () => MACHINE,
              commits: async (): Promise<Commit[]> => [{ sha: "abc1234", timestamp: 1000 }],
            }
          : { loopMarkdown: async () => PROSE, commits: async (): Promise<Commit[]> => [] },
    );

    expect(projects).toHaveLength(2);
    expect(projects.find((p) => p.project === "clean")!.report.score.score).toBe(100);
    expect(projects.find((p) => p.project === "prose")!.report.score.coverage).toBe(0);
  });

  it("skips a repo whose source throws, without failing the whole batch", async () => {
    const projects = await ingestField(
      [
        { handle: "a", project: "ok", owner: "o", repo: "ok" },
        { handle: "b", project: "bad", owner: "o", repo: "bad" },
      ],
      (r) => ({
        loopMarkdown: async () => {
          if (r.repo === "bad") throw new Error("404");
          return MACHINE;
        },
        commits: async (): Promise<Commit[]> => [{ sha: "abc1234", timestamp: 1000 }],
      }),
    );
    expect(projects.map((p) => p.project)).toEqual(["ok"]);
  });

  it("aggregates into a fair index: machine-checkable verified, prose neutral", async () => {
    const projects = await ingestField(
      [
        { handle: "a", project: "clean", owner: "o", repo: "clean" },
        { handle: "b", project: "prose", owner: "o", repo: "prose" },
      ],
      (r) =>
        r.repo === "clean"
          ? {
              loopMarkdown: async () => MACHINE,
              commits: async (): Promise<Commit[]> => [{ sha: "abc1234", timestamp: 1000 }],
            }
          : { loopMarkdown: async () => PROSE, commits: async (): Promise<Commit[]> => [] },
    );
    const { entries } = aggregateSeason(projects);
    expect(entries[0].status).toBe("verified");
    expect(entries.find((e) => e.project === "prose")!.status).toBe("narrative");
  });
});

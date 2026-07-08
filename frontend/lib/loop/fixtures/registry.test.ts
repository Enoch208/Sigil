import { describe, it, expect } from "vitest";
import { getProjectSources, listProjects } from "./registry";

describe("fixture project registry", () => {
  it("returns sources for a known project, case-insensitively", () => {
    expect(getProjectSources("loopscope", "sigil")).not.toBeNull();
    expect(getProjectSources("LoopScope", "Sigil")).not.toBeNull();
  });

  it("returns null for an unknown project", () => {
    expect(getProjectSources("nobody", "nothing")).toBeNull();
  });

  it("exposes a contested demo project whose log contains a contradiction", () => {
    const src = getProjectSources("loopscope", "contested");
    expect(src).not.toBeNull();
    expect(src!.loopMarkdown).toContain("deadbee");
  });
});

describe("listProjects", () => {
  it("enumerates every registered project, including a run-verdict demo", () => {
    const all = listProjects();
    const ids = all.map((p) => `${p.handle}/${p.project}`);
    expect(all.length).toBeGreaterThanOrEqual(3);
    expect(ids).toContain("loopscope/sigil");
    expect(ids).toContain("nexus/authflow");
  });
});

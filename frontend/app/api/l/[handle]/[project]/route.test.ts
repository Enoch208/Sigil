import { describe, it, expect } from "vitest";
import { GET } from "./route";

function ctx(handle: string, project: string) {
  return { params: Promise.resolve({ handle, project }) };
}

describe("GET /api/l/[handle]/[project]", () => {
  it("returns report + timeline JSON for a known project", async () => {
    const res = await GET(new Request("http://test/"), ctx("loopscope", "sigil"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const data = await res.json();
    expect(data.report.score.score).toBeGreaterThanOrEqual(95);
    expect(data.timeline.iterations).toBe(3);
  });

  it("404s for an unknown project", async () => {
    const res = await GET(new Request("http://test/"), ctx("x", "y"));
    expect(res.status).toBe(404);
  });
});

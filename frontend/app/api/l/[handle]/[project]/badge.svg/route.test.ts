import { describe, it, expect } from "vitest";
import { GET } from "./route";

function ctx(handle: string, project: string) {
  return { params: Promise.resolve({ handle, project }) };
}

describe("GET /api/l/[handle]/[project]/badge.svg", () => {
  it("serves an SVG badge for a known project", async () => {
    const res = await GET(new Request("http://test/"), ctx("loopscope", "sigil"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/svg+xml");
    const body = await res.text();
    expect(body.startsWith("<svg")).toBe(true);
    expect(body).toContain("integrity");
  });

  it("sets a cache header within the freshness window (TC-PUB)", async () => {
    const res = await GET(new Request("http://test/"), ctx("loopscope", "sigil"));
    expect(res.headers.get("cache-control")).toContain("max-age=60");
  });

  it("404s for an unknown project (TC-PUB-02)", async () => {
    const res = await GET(new Request("http://test/"), ctx("nobody", "nothing"));
    expect(res.status).toBe(404);
  });
});

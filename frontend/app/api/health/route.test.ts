import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("reports ok, a commit marker, and is not cached", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("no-store");
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(typeof body.commit).toBe("string");
    expect(typeof body.time).toBe("string");
  });
});

import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/season", () => {
  it("returns the aggregated Season Index over all demo projects", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");

    const summary = await res.json();
    expect(summary.totals.projects).toBeGreaterThanOrEqual(3);
    // clean project ranks first and is verified; a tampered one is contested
    expect(summary.entries[0].status).toBe("verified");
    expect(summary.entries.some((e: { status: string }) => e.status === "contested")).toBe(true);
    // fingerprints surface at least one failing-check class across the season
    expect(summary.fingerprints.length).toBeGreaterThan(0);
  });

  it("sets a cache header within the freshness window", async () => {
    const res = await GET();
    expect(res.headers.get("cache-control")).toContain("max-age=60");
  });
});

import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/methodology", () => {
  it("serves the published methodology with the engine's constants", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    const m = await res.json();
    expect(m.penaltyPerContradiction).toBe(25);
    expect(typeof m.formulas.score).toBe("string");
    expect(m.verdicts.length).toBe(4);
    expect(m.checks.length).toBeGreaterThanOrEqual(6);
  });
});

import { describe, it, expect } from "vitest";
import {
  renderBadge,
  loopBadge,
  BADGE_CONTENT_TYPE,
  BADGE_CACHE_CONTROL,
} from "./badge";
import type { LoopScore } from "./types";

function score(p: Partial<LoopScore>): LoopScore {
  return {
    score: 0,
    coverage: 0,
    integrity: 0,
    total: 0,
    checkable: 0,
    verified: 0,
    verdictMismatch: 0,
    unverifiable: 0,
    contradicted: 0,
    ...p,
  };
}

function widthOf(svg: string): number {
  return Number(svg.match(/width="(\d+)"/)![1]);
}

describe("renderBadge", () => {
  it("produces a well-formed SVG carrying both segments and the color", () => {
    const svg = renderBadge({ label: "loop", message: "integrity 96", color: "#3fb950" });
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('role="img"');
    expect(svg).toContain("loop");
    expect(svg).toContain("integrity 96");
    expect(svg).toContain("#3fb950");
    expect(svg.trimEnd().endsWith("</svg>")).toBe(true);
  });

  it("escapes XML metacharacters so message content cannot inject markup (TC-PUB security)", () => {
    const svg = renderBadge({ label: "a&b", message: '<script>"x"', color: "#000" });
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
    expect(svg).toContain("a&amp;b");
  });

  it("widens the badge as the message grows", () => {
    const short = renderBadge({ label: "loop", message: "x", color: "#000" });
    const long = renderBadge({ label: "loop", message: "x".repeat(40), color: "#000" });
    expect(widthOf(long)).toBeGreaterThan(widthOf(short));
  });

  it("exposes an accessible aria-label with both segments", () => {
    const svg = renderBadge({ label: "loop", message: "integrity 96", color: "#3fb950" });
    expect(svg).toContain('aria-label="loop: integrity 96"');
  });
});

describe("loopBadge", () => {
  it("renders the verified badge for a high, uncontradicted score", () => {
    const svg = loopBadge(score({ score: 96, integrity: 96, total: 71 }), {
      iterations: 71,
      banked: 52,
    });
    expect(svg).toContain("verified");
    expect(svg).toContain("71 iter");
    expect(svg).toContain("52 banked");
    expect(svg).toContain("integrity 96");
    expect(svg).toContain("#3fb950"); // green band
  });

  it("marks a contradicted log as contested in red regardless of score", () => {
    const svg = loopBadge(score({ score: 70, integrity: 95, total: 20, contradicted: 1 }), {
      iterations: 20,
      banked: 18,
    });
    expect(svg).toContain("contested");
    expect(svg).toContain("#e5534b"); // red band
  });

  it("uses a mid-band color for a middling score", () => {
    const svg = loopBadge(score({ score: 60, integrity: 60, total: 10 }), {
      iterations: 10,
      banked: 5,
    });
    expect(svg).toContain("#cc6b2c"); // orange band (50–74)
  });

  it("defaults the iteration count to the scored line total", () => {
    const svg = loopBadge(score({ score: 100, integrity: 100, total: 5 }), { banked: 5 });
    expect(svg).toContain("5 iter");
  });
});

describe("badge serving constants (TC-PUB freshness)", () => {
  it("declares an SVG content type and a ≤60s cache window", () => {
    expect(BADGE_CONTENT_TYPE).toBe("image/svg+xml");
    expect(BADGE_CACHE_CONTROL).toContain("max-age=60");
  });
});

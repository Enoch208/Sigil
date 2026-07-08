import { describe, it, expect } from "vitest";
import { parseLoopMd } from "./parser";

const CANONICAL =
  '[maker=claude-code] [iter=017] TC-VERIFY-04 "contradicted SHA drops score" → FAIL (score unchanged) → fixed recompute trigger on re-ingest → PASS banked [commit ab3f2e1 · run r_9d2kq]';

describe("parseLoopMd — canonical line (TC-PARSE-01)", () => {
  it("extracts every field from the machine-checkable line", () => {
    const { lines } = parseLoopMd(CANONICAL);
    expect(lines).toHaveLength(1);
    const line = lines[0];
    expect(line.maker).toBe("claude-code");
    expect(line.iter).toBe(17);
    expect(line.testId).toBe("TC-VERIFY-04");
    expect(line.description).toBe("contradicted SHA drops score");
    expect(line.claimedVerdict).toBe("pass");
    expect(line.banked).toBe(true);
    expect(line.commitSha).toBe("ab3f2e1");
    expect(line.runId).toBe("r_9d2kq");
    expect(line.parseFlags).toEqual([]);
    expect(line.sourceLineNo).toBe(1);
  });
});

describe("parseLoopMd — empty & non-loop input", () => {
  it("returns an empty result for empty input (TC-PARSE-10)", () => {
    expect(parseLoopMd("")).toEqual({ lines: [], totalLines: 0, ignored: 0 });
  });

  it("ignores headings and prose that are not loop lines", () => {
    const { lines, ignored } = parseLoopMd("# My Loop\n\nJust some prose here.");
    expect(lines).toHaveLength(0);
    expect(ignored).toBe(2);
  });
});

describe("parseLoopMd — tolerant flags (TC-PARSE-02..09)", () => {
  it("flags a missing maker tag but still parses the line", () => {
    const { lines } = parseLoopMd(
      '[iter=3] TC-AUTH-01 "denied oauth" → FAIL [commit abc1234 · run r_2]',
    );
    expect(lines[0].maker).toBeUndefined();
    expect(lines[0].parseFlags).toContain("missing-maker");
    expect(lines[0].testId).toBe("TC-AUTH-01");
  });

  it("flags a malformed iteration without crashing", () => {
    const { lines } = parseLoopMd(
      '[maker=x] [iter=abc] TC-P-01 "x" → PASS [commit abc1234 · run r_1]',
    );
    expect(lines[0].iter).toBeUndefined();
    expect(lines[0].parseFlags).toContain("malformed-iter");
  });

  it("marks a line with no SHA and no run id as no-anchors", () => {
    const { lines } = parseLoopMd('[maker=x] [iter=1] TC-P-02 "no anchors" → PASS');
    expect(lines[0].commitSha).toBeUndefined();
    expect(lines[0].runId).toBeUndefined();
    expect(lines[0].parseFlags).toContain("no-anchors");
  });

  it("flags duplicate iterations without treating them as fatal (TC-PARSE-07)", () => {
    const src = [
      '[maker=x] [iter=5] TC-A-01 "a" → PASS [run r_1]',
      '[maker=x] [iter=5] TC-A-02 "b" → PASS [run r_2]',
    ].join("\n");
    const { lines } = parseLoopMd(src);
    expect(lines).toHaveLength(2);
    expect(lines[0].parseFlags).toContain("duplicate-iter");
    expect(lines[1].parseFlags).toContain("duplicate-iter");
  });
});

describe("parseLoopMd — real-world messiness (TC-PARSE-04,06,12,13)", () => {
  it("preserves non-ASCII descriptions while extracting ASCII anchors", () => {
    const { lines } = parseLoopMd(
      '[maker=nexus] [iter=9] TC-AR-01 "تم إصلاح المصادقة ✅" → PASS banked [commit deadbee · run r_ar]',
    );
    expect(lines[0].description).toBe("تم إصلاح المصادقة ✅");
    expect(lines[0].commitSha).toBe("deadbee");
    expect(lines[0].runId).toBe("r_ar");
    expect(lines[0].claimedVerdict).toBe("pass");
  });

  it("handles CRLF line endings (TC-PARSE-06)", () => {
    const { lines } = parseLoopMd(
      '[maker=x] [iter=1] TC-A-01 "a" → PASS [run r_1]\r\n[maker=x] [iter=2] TC-A-02 "b" → PASS [run r_2]',
    );
    expect(lines).toHaveLength(2);
    expect(lines[1].iter).toBe(2);
  });

  it("ignores lines inside fenced code blocks (TC-PARSE-12)", () => {
    const src = [
      "```",
      'TC-FAKE-01 "inside a fence" → PASS [run r_fake]',
      "```",
      '[maker=x] [iter=1] TC-REAL-01 "real" → PASS [commit abc1234 · run r_1]',
    ].join("\n");
    const { lines } = parseLoopMd(src);
    expect(lines).toHaveLength(1);
    expect(lines[0].testId).toBe("TC-REAL-01");
  });

  it("degrades a loose per-sprint line to partial data without crashing (TC-PARSE-13)", () => {
    const { lines } = parseLoopMd("Sprint 3 — TC-KW-12 covered the manifest path");
    expect(lines).toHaveLength(1);
    expect(lines[0].testId).toBe("TC-KW-12");
    expect(lines[0].parseFlags).toContain("no-verdict");
    expect(lines[0].parseFlags).toContain("no-anchors");
  });
});

describe("parseLoopMd — performance (TC-PARSE-05)", () => {
  it("parses 10k lines in under 2s", () => {
    const src = Array.from(
      { length: 10_000 },
      (_, i) =>
        `[maker=x] [iter=${i}] TC-PERF-${i} "line ${i}" → PASS banked [commit abc1234 · run r_${i}]`,
    ).join("\n");
    const start = performance.now();
    const { lines } = parseLoopMd(src);
    const elapsed = performance.now() - start;
    expect(lines).toHaveLength(10_000);
    expect(elapsed).toBeLessThan(2000);
  });
});

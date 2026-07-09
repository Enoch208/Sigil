#!/usr/bin/env node
// Sigil GitHub Action entrypoint — self-contained (Node built-ins only).
// Cross-verifies the consuming repo's LOOP.md against its git history and
// reports a Loop Integrity Score. Mirrors the rules of frontend/lib/loop.
import { execFileSync } from "node:child_process";
import { readFileSync, appendFileSync } from "node:fs";

const LOOP_FILE = process.env.INPUT_LOOP_FILE || "LOOP.md";
const THRESHOLD = Number(process.env.INPUT_THRESHOLD || "0");

// --- git commits (sha -> unix ms) ---
const commits = new Map();
try {
  for (const l of execFileSync("git", ["log", "--pretty=%h|%ct"]).toString().trim().split("\n")) {
    const [s, c] = l.split("|");
    if (s) commits.set(s, Number(c) * 1000);
  }
} catch {
  /* no git history — every line becomes unverifiable */
}
const findCommit = (sha) => {
  if (commits.has(sha)) return commits.get(sha);
  for (const [s, ts] of commits) if (s.startsWith(sha) || sha.startsWith(s)) return ts;
  return undefined;
};

// --- parse (bracket-anchored, fence-aware; same rules as the engine) ---
const CANDIDATE = /\[maker=|\[iter=|\bTC-[A-Za-z]+-\d+|\b(PASS|FAIL)\b/i;
const COMMIT = /\bcommit\s+([0-9a-f]{6,40})\b/i;
const RUN = /\brun\s+([A-Za-z0-9_-]+)/i;
const ANCHOR = /\[[^\]]*\]/g;
let inFence = false;
const lines = [];
for (const raw of readFileSync(LOOP_FILE, "utf8").split(/\r?\n/)) {
  const t = raw.trim();
  if (/^```/.test(t)) { inFence = !inFence; continue; }
  if (!t || inFence || !CANDIDATE.test(raw)) continue;
  const anchor = (raw.match(ANCHOR) || []).join(" ");
  lines.push({
    sha: (anchor.match(COMMIT) || [])[1]?.toLowerCase(),
    run: (anchor.match(RUN) || [])[1],
  });
}

// --- verify (git-only: sha existence + chronological order) ---
let verified = 0, contradicted = 0, maxTs = -Infinity;
for (const ln of lines) {
  if (!ln.sha) continue; // no git anchor (or run-only, runs not ingested here) -> unverifiable
  const ts = findCommit(ln.sha);
  if (ts === undefined) { contradicted++; continue; }
  if (ts < maxTs) { contradicted++; continue; }
  maxTs = Math.max(maxTs, ts);
  verified++;
}
const total = lines.length;
const checkable = verified + contradicted;
const ratio = checkable === 0 ? 0 : verified / checkable;
const score = Math.max(0, Math.min(100, Math.round(100 * ratio) - 25 * contradicted));
const integrity = Math.round(100 * ratio);
const coverage = total === 0 ? 0 : Math.round((100 * checkable) / total);

const summary = `## Sigil — Loop Integrity\n\n**Score ${score}** · integrity ${integrity} · coverage ${coverage} · ${verified}/${total} verified · ${contradicted} contradicted\n`;
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
if (process.env.GITHUB_OUTPUT)
  appendFileSync(process.env.GITHUB_OUTPUT, `score=${score}\nintegrity=${integrity}\ncontradicted=${contradicted}\n`);

if (contradicted > 0 || score < THRESHOLD) {
  console.error(`::error::Loop Integrity ${score} (contradicted ${contradicted}) — below threshold ${THRESHOLD} or has contradicted lines`);
  process.exit(1);
}

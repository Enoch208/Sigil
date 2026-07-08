# Loopscope

**The auditor for AI coding loops.** Point it at any project's `LOOP.md`, git history, and TestSprite runs; it cross-verifies all three line-by-line into a **Loop Integrity Score (0–100)** and renders the loop as a shareable, badge-backed page.

> `loop · verified · 14 iter · 14 banked · integrity 100` — the SVG badge served at `/api/l/{handle}/{project}/badge.svg`

Built for TestSprite Hackathon Season 3. Repo/codename: **Sigil**.

## Why it's different

Every other loop tool in the field **records** or **displays** the loop. Loopscope **verifies** it.

Given a `LOOP.md`, it checks every line against the real evidence — SHA existence and order, run verdict, timestamp coherence, banked passes — and assigns a per-line verdict (`verified` / `unverifiable` / `contradicted` / `verdict-mismatch`) plus an open, reproducible score.

Our own loop, audited by our own engine, scores **integrity 100 with zero contradicted lines** — see [`LOOP.md`](./LOOP.md). And it stays that way: CI fails the build if it ever drops below 95.

## The scoring methodology (published, matches the code)

```
checkable  = verified + verdict-mismatch + contradicted
Coverage   = checkable / total
Integrity  = (verified + verdict-mismatch) / checkable      (0 when nothing is checkable)
Score      = clamp( round(100 × Integrity) − 25 × contradicted , 0, 100 )
```

- **Unverifiable lines are neutral** — they lower Coverage, never the score of a log that has verified content.
- **Anti-gaming:** a log with nothing checkable scores 0, not 100 — an unproven log is not a trusted one.
- **`blocked` with passing assertions** is classified as a *verdict mismatch* (known checker issue), never as a failure and never hidden.

The constants above live in `frontend/lib/loop/scoring.ts`; the published methodology is generated from them (`methodology.ts`), so the page can never drift from the engine.

## What it produces

- **Verify** — per-line verdicts + Loop Integrity Score across `LOOP.md` × git × runs.
- **Timeline** — write→fix→pass replay rail, time-to-green per failure, banked-suite growth.
- **Badge** — self-contained SVG for READMEs, color-banded by score.
- **Season Index** — every project scored in one place, with Failure Fingerprints. Logs that aren't machine-checkable are marked **narrative** (neutral) — never scored down.

## Verification

- **92 behavior tests** (Vitest) across the pure logic layer — parser, verifier, scoring, timeline, badge, season, ingestion, API routes.
- **Every-push CI** (`.github/workflows/ci.yml`): lint → typecheck → tests → **self-audit gate**.
- Behavior-first protocol: no implementation before a failing test. Every `LOOP.md` line carries a commit SHA so the log is self-proving.

## Quickstart

```bash
cd frontend
npm install
npm run dev         # http://localhost:3000
npm run test        # 92 tests
npm run self-audit  # score our own LOOP.md (must be ≥ 95, 0 contradicted)
```

## API

| Route | Returns |
|---|---|
| `GET /api/l/{handle}/{project}/badge.svg` | SVG badge (`image/svg+xml`, 60s cache) |
| `GET /api/l/{handle}/{project}` | `{ report, timeline }` JSON |
| `GET /api/season` | aggregated Season Index + fingerprints |

Public-repo ingestion works with a GitHub token in `frontend/.env.local` (`GITHUB_TOKEN`). TestSprite run ingestion is wired behind a `RunSource` interface.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · Vitest · Vercel-ready.

## Status

Engine, GitHub ingestion, Season Index, badges, and CI + self-audit gate are **done and verified**. Live TestSprite run ingestion, deployment URL, and the public Season Index (organizer-blessed, opt-out honored) are in progress.

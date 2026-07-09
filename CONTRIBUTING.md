# Contributing to Sigil

Thanks for your interest. Sigil is an auditor for AI coding loops, so it holds
itself to the protocol it verifies.

## Development

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
npm test             # 101 unit tests (Vitest)
npm run typecheck
npm run lint
npm run self-audit   # our own LOOP.md must score >= 95, 0 contradicted
```

## The loop protocol (non-negotiable)

Every change to product logic follows behavior-first:

1. Write a **failing test first** (expected red).
2. Implement from the failure until it goes green.
3. Commit — one feature per commit, so each `LOOP.md` line maps to a real SHA.
4. Where the change is a live behavior, verify it with TestSprite
   (`testsprite test create --type backend … --run --wait`) and bank the run ID.

No production code without a failing test first. The CI gate (`.github/workflows/ci.yml`)
runs lint, typecheck, the full suite, and the self-audit — the build fails if our
own Loop Integrity Score drops below 95 or any `LOOP.md` line is contradicted.

## Ground rules

- Keep the engine (`frontend/lib/loop`) pure and framework-free.
- Never fabricate a `LOOP.md` line. The whole product dies if the auditor's own
  log can't be trusted.
- Zero secrets in git. `GITHUB_TOKEN` / `TESTSPRITE_API_KEY` live in
  `frontend/.env.local` only.

## Reporting issues

Open a GitHub issue with the `LOOP.md`, repo, and expected vs actual verdict.

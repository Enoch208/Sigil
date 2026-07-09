# TestSprite suite

**57 backend (API) behavior tests — all passing** against the deployed app
(`https://sigil-umber.vercel.app`), run by the TestSprite CLI. Each is a
self-contained Python script hitting the live API over HTTP; TestSprite executes
them in its sandbox and records a run ID + verdict. Backend runs bill **0
credits**, so the whole suite gates every deploy for free.

TestSprite project: `Loopscope` (`1a9ed16f-19a2-46aa-b102-b164985a15ff`, backend).

Run the whole suite:

```bash
testsprite test run --all --project 1a9ed16f-19a2-46aa-b102-b164985a15ff --wait
# → Batch run complete: 57/57 passed, 0 failed/blocked, 0 timed out
```

Create + run one:

```bash
testsprite test create --type backend --project 1a9ed16f-19a2-46aa-b102-b164985a15ff \
  --name "verified badge shows integrity 100" \
  --code-file testsprite/badge_sigil_integrity.py --run --wait
```

## Coverage

| Area | Behaviors verified |
|---|---|
| `/api/health` | ok status · deployed commit · no-store · json · ISO time |
| verified badge | 200 · svg content-type/well-formed · integrity 100 · green band · a11y (role/aria) · 60s cache |
| contested / authflow badges | 200 · "contested" · red band · svg |
| badge robustness | case-insensitive lookup · unknown → 404 · malformed handle doesn't 500 |
| report (sigil) | score/integrity/coverage 100 · 0 contradicted · timeline · verdict-per-line · cache |
| report (contested / authflow) | ≥1 contradiction · score < 100 · a contradicted verdict present |
| report negatives | unknown → 404 |
| `/api/season` | ranked desc · verified entry · valid status enum · fingerprints · mismatch rate · deterministic order · totals shape |
| landing | 200 · html |

Run IDs for representative iterations are banked line-by-line in the repo-root
[`LOOP.md`](../LOOP.md).

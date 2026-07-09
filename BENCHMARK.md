# Verification benchmark

Sigil's job is to be **right** about a loop — and, above all, to never fabricate a
failure. This is how the verifier is measured.

## What "accuracy" means here

An auditor has two failure modes, and they are not equal:

- **False contradiction** (calling an honest line a lie) — catastrophic. It's
  defamatory and destroys the auditor's credibility the instant someone checks.
- **Missed check** (marking a line unverifiable) — acceptable. Neutral, honest,
  recoverable.

Sigil is tuned to **drive false contradictions to zero**, then maximise coverage.

## Fixtures & results

| Suite | Cases | Result |
|---|---|---|
| Unit (Vitest) | **101** across parser, verifier, scoring, timeline, badge, season, ingestion, API | 101/101 pass |
| Adversarial guard | prose + markdown-table logs (real Season 3 shapes) | **0 false contradictions** — every non-anchored line is `unverifiable`, never `contradicted` |
| Clean loop fixture | a fully machine-checkable log | scores **100 / 0 contradicted** |
| Tampered fixture | one commit SHA altered | correctly `contradicted`, score drops to 42 |
| Our own `LOOP.md` | 22 real iterations vs real git + TestSprite | **integrity 100, 22/22 verified, 0 contradicted** (`npm run self-audit`, `npm run run-verify`) |

## Real-field precision (the number that matters)

Sigil was run live against **6 real Season 3 competitor repos** (LoopLedger,
Loop Arena, LoopLens, KnowledgeWar, StatusPulse, EnquiryOS) via the GitHub API:

| Metric | Value |
|---|---|
| False contradictions across the field | **0** |
| Narrative (prose) logs correctly marked neutral, not scored down | **6 / 6** |
| Our own log, machine-verifiable line-by-line | the only one in the field |

An earlier build **did** produce false contradictions — the parser read the
English word "run" in prose ("run finished ~10 min later") as a run-ID claim.
That bug was caught, fixed (anchors are extracted only from the `[commit · run]`
bracket group), and locked behind a permanent regression guard
([`adversarial.test.ts`](frontend/lib/loop/adversarial.test.ts)). Catching our own
false positive is the benchmark that matters most.

## Reproduce

```bash
cd frontend
npm test            # 101 unit tests
npm run self-audit  # our own LOOP.md → 100 / 0 contradicted
npm run run-verify  # fetch our TestSprite runs and re-check them (6/6 green)
```

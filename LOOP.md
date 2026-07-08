# LOOP.md — Loopscope (Sigil)

**The auditor for AI coding loops, audited by itself.**

Behavior-first protocol, no exceptions: plan → write a failing test (expected red) → implement from the failure → rerun → green banks → the commit carries the SHA. Every iteration below is a real commit in this repository, cross-verified by Loopscope's own engine (`frontend/lib/loop`).

**Verification status:** git-verified — every SHA exists and lands in chronological order, scored by our own verifier at **integrity 100 / 0 contradicted**. TestSprite run IDs are the next banked layer (added when the CLI gate lands); until then run-verification is marked *not-yet-ingested* and treated neutrally by the engine, never as a green we did not earn.

## Iterations (logic layer — behavior-first, Vitest red→green)

[maker=claude-code] [iter=01] TC-TYPE-01 "domain contracts and source interfaces" → PASS banked [commit 5b4e0fe]

[maker=claude-code] [iter=02] TC-PARSE-01 "tolerant LOOP.md parser: canonical, multilingual, CRLF, 10k under 2s" → FAIL (expected red) → implemented parser → PASS banked [commit 40901f9]

[maker=claude-code] [iter=03] TC-VERIFY-01 "cross-source line verifier: SHA order, run verdict, coherence, banked" → FAIL (expected red) → implemented verifier → PASS banked [commit ddf5e97]

[maker=claude-code] [iter=04] TC-SCORE-01 "Loop Integrity scoring with anti-gaming zero-checkable floor" → FAIL (expected red) → implemented scoring → PASS banked [commit 30c30b3]

[maker=claude-code] [iter=05] TC-TIME-01 "loop timeline, time-to-green, banked-suite growth" → FAIL (expected red) → implemented timeline → PASS banked [commit 0b77d68]

[maker=claude-code] [iter=06] TC-BADGE-01 "injection-safe SVG badge, score-banded color" → FAIL (expected red) → implemented badge → PASS banked [commit 3f5faec]

[maker=claude-code] [iter=07] TC-SEASON-01 "season index aggregation and failure fingerprints" → FAIL (expected red) → implemented aggregation → PASS banked [commit 0798138]

[maker=claude-code] [iter=08] TC-AUDIT-01 "audit orchestration: parse then verify then timeline" → FAIL (expected red) → implemented audit → PASS banked [commit 88d7c89]

[maker=claude-code] [iter=09] TC-ENGINE-01 "end-to-end engine on clean and tampered fixtures" → FAIL (expected red) → wired barrel and fixtures → PASS banked [commit 1fd1324]

[maker=claude-code] [iter=10] TC-METHOD-01 "published methodology matches engine constants" → FAIL (expected red) → implemented methodology → PASS banked [commit 8b8eff1]

[maker=claude-code] [iter=11] TC-PUB-01 "badge SVG and report JSON API routes with cache headers" → FAIL (expected red) → implemented routes → PASS banked [commit 7b3c992]

[maker=claude-code] [iter=12] TC-IDX-01 "season index API route over all projects" → FAIL (expected red) → implemented route → PASS banked [commit 78e42f1]

[maker=claude-code] [iter=13] TC-VERIFY-13 "source availability: an un-ingested source is neutral, not contradicted" → FAIL (expected red) → hardened verifier → PASS banked [commit 190c11e]

[maker=claude-code] [iter=14] TC-INGEST-01 "GitHub commits and LOOP.md ingestion mappers" → FAIL (expected red) → implemented adapter → PASS banked [commit 61e371f]

## Banked coverage

83 behavior tests bank green across the pure logic layer (parser 12, verifier 13, scoring 7, timeline 6, badge 9, season 8, audit 2, engine 2, methodology 4, registry 4, ingestion 9, API routes 7). Run `cd frontend && npm run test`.

## Guardrails

- No implementation before a failing test (see each iteration's expected-red).
- Same failure signature twice → stop and rethink.
- The auditor's own integrity must stay ≥ 95 with zero contradicted lines. This log is scored by `frontend/lib/loop` on every ingest; if any line above is contradicted, our own score drops — by construction, honesty is cheaper than fabrication.

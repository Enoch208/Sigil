# LOOP.md — Sigil

**The auditor for AI coding loops, audited by itself.**

Behavior-first protocol, no exceptions: plan → write a failing test (expected red) → implement from the failure → rerun → green banks → the commit carries the SHA. Every iteration below is a real commit in this repository, cross-verified by Sigil's own engine (`frontend/lib/loop`).

**Verification status:** git-verified **and** run-verified. Every SHA exists and lands in chronological order (our own verifier scores this log at **integrity 100 / 0 contradicted**), and the loop is verified live against the deployed app by **TestSprite** — real run IDs banked below.

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

## Live verification (TestSprite, against the deployed app at commit 49b830c)

**57 TestSprite backend tests are green against the deployed app** (`https://sigil-umber.vercel.app`) — full suite in [`testsprite/`](./testsprite/); `testsprite test run --all` → 57/57 green, zero red. Backend runs bill 0 credits, so the live suite gates every deploy. Six representative iterations are banked below with their run IDs, each verifiable in the TestSprite dashboard.

[maker=claude-code] [iter=15] TC-LIVE-01 "health probe returns ok with a deployed commit" → BLOCKED (base url undefined) → hardcoded base url → PASS banked [commit 49b830c · run fa460787-7b7b-41e7-83b2-54091fb24bbf]

[maker=claude-code] [iter=16] TC-LIVE-02 "season index returns projects with a verified entry" → PASS banked [commit 49b830c · run e6ee97ea-8171-4b61-a708-0503783c748d]

[maker=claude-code] [iter=17] TC-LIVE-03 "verified badge is SVG and shows integrity 100" → PASS banked [commit 49b830c · run 74f29f2d-b891-4fa6-bb2f-85de27cfa988]

[maker=claude-code] [iter=18] TC-LIVE-04 "contested badge renders red" → PASS banked [commit 49b830c · run 509d0227-2177-475f-934b-6280e69ae56b]

[maker=claude-code] [iter=19] TC-LIVE-05 "report scores the clean loop 100 with zero contradicted" → PASS banked [commit 49b830c · run 378b7922-7ca3-4919-81ff-68172f021fc7]

[maker=claude-code] [iter=20] TC-LIVE-06 "unknown project returns 404" → PASS banked [commit 49b830c · run 31e2eb5a-58f2-49d2-a140-4c18c6a97a27]

## Banked coverage

83 behavior tests bank green across the pure logic layer (parser 12, verifier 13, scoring 7, timeline 6, badge 9, season 8, audit 2, engine 2, methodology 4, registry 4, ingestion 9, API routes 7). Run `cd frontend && npm run test`.

## Guardrails

- No implementation before a failing test (see each iteration's expected-red).
- Same failure signature twice → stop and rethink.
- The auditor's own integrity must stay ≥ 95 with zero contradicted lines. This log is scored by `frontend/lib/loop` on every ingest; if any line above is contradicted, our own score drops — by construction, honesty is cheaper than fabrication.

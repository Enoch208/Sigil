# Changelog

All notable changes to Sigil. Format loosely follows
[Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Added
- **Engine-side run verification** — the verifier fetches this repo's `LOOP.md`
  run IDs from TestSprite and re-checks `run-exists` + `run-verdict` itself
  (`npm run run-verify`, 6/6 green). The loop is now git-verified *and*
  run-verified by the auditor.
- **TestSprite run mapper** — maps run JSON to the engine `Run`, distinguishing a
  real block from the blocked-with-passing-assertions verdict-mismatch.
- **Live Season 3 field audit** — GitHub ingestion (paginated) scores real
  competitor repos; prose logs are marked `narrative`, never scored down.
- **Season Index + Failure Fingerprints**, **SVG badges**, **replay timeline**,
  **`/api/health`** deployed-commit probe.
- **57 TestSprite backend tests** against the live app (`testsprite test run --all`).
- **Every-push CI + self-audit gate** (build fails if our own integrity < 95) and
  a **nightly regression** with a live smoke test.
- **Published methodology** generated from the scoring constants.

### Fixed
- **False-contradiction bug** — anchors are now extracted only from the
  `[commit · run]` bracket group, so prose ("run finished…") can never fabricate a
  contradiction. Locked behind a regression guard.
- Short↔full SHA matching, anti-gaming zero-checkable floor, source-availability
  neutrality.

### Meta
- Own `LOOP.md`: 22 machine-verified iterations, integrity 100, 0 contradicted.
- 101 unit tests + 57 live TestSprite tests. Zero secrets in git.

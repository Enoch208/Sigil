# Security policy

## Reporting a vulnerability

Please report security issues privately via a
[GitHub security advisory](https://github.com/Enoch208/Sigil/security/advisories/new)
or by email to the maintainer, rather than a public issue. You'll get a response
within a few days.

## Handling of secrets & data

- **Zero secrets in git.** GitHub OAuth/PAT and the TestSprite key live only in
  `frontend/.env.local` (git-ignored). CI reads them from repository secrets.
- Sigil ingests **public** repository data (commits, `LOOP.md`) and TestSprite run
  metadata. It renders another project's data **read-only** and marks
  non-machine-checkable logs neutrally — it never retrieves restricted data and
  relabels it.
- The badge and report endpoints are XML/HTML-escaped against injection (see the
  badge injection tests) and rate-limit-friendly (60s cache).

## Supported versions

The `main` branch is the supported version during the hackathon review window.

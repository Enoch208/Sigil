# TestSprite suite

Backend (API) behavior tests run by the TestSprite CLI against the deployed app
(`https://sigil-umber.vercel.app`). Each is a self-contained Python script hitting
the live API over HTTP — TestSprite executes them in its sandbox and records a
run ID + verdict (the run IDs are banked in the repo-root `LOOP.md`).

TestSprite project: `Loopscope` (`1a9ed16f-19a2-46aa-b102-b164985a15ff`, backend).

Run one:

```bash
testsprite test create --type backend --project 1a9ed16f-19a2-46aa-b102-b164985a15ff \
  --name "health probe returns ok with a deployed commit" \
  --code-file testsprite/health.py --run --wait
```

| File | Verifies |
|---|---|
| `health.py` | `/api/health` returns `ok` + the deployed commit |
| `season.py` | `/api/season` returns projects with a verified entry |
| `badge_verified.py` | verified badge is SVG and shows `integrity 100` |
| `badge_contested.py` | contested badge renders red |
| `report.py` | report scores the clean loop 100 with 0 contradicted |
| `not_found.py` | unknown project returns 404 |

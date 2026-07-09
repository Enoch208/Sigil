import requests
BASE_URL = "https://sigil-umber.vercel.app"
def test_verified_badge():
    r = requests.get(f"{BASE_URL}/api/l/loopscope/sigil/badge.svg", timeout=30)
    assert r.status_code == 200, r.status_code
    assert "image/svg+xml" in r.headers.get("content-type",""), r.headers.get("content-type")
    assert r.text.startswith("<svg"), r.text[:40]
    assert "integrity 100" in r.text, "expected integrity 100"
test_verified_badge()

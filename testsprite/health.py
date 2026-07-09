import requests

BASE_URL = "https://sigil-umber.vercel.app"

def test_health_ok():
    r = requests.get(f"{BASE_URL}/api/health", timeout=30)
    assert r.status_code == 200, f"expected 200, got {r.status_code}"
    body = r.json()
    assert body.get("status") == "ok", f"status not ok: {body}"
    assert isinstance(body.get("commit"), str) and len(body["commit"]) > 0, "missing deployed commit"

test_health_ok()

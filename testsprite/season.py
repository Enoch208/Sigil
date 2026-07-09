import requests
BASE_URL = "https://sigil-umber.vercel.app"
def test_season_index():
    r = requests.get(f"{BASE_URL}/api/season", timeout=30)
    assert r.status_code == 200, r.status_code
    d = r.json()
    assert d["totals"]["projects"] >= 3, d["totals"]
    assert any(e["status"] == "verified" for e in d["entries"]), "no verified entry"
test_season_index()

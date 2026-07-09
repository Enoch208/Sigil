import requests
BASE_URL = "https://sigil-umber.vercel.app"
def test_contested_badge_is_red():
    r = requests.get(f"{BASE_URL}/api/l/loopscope/contested/badge.svg", timeout=30)
    assert r.status_code == 200, r.status_code
    assert "contested" in r.text, "expected contested"
    assert "#e5534b" in r.text, "expected red fill"
test_contested_badge_is_red()

import requests
BASE_URL = "https://sigil-umber.vercel.app"
def test_unknown_project_404():
    r = requests.get(f"{BASE_URL}/api/l/nobody/nothing/badge.svg", timeout=30)
    assert r.status_code == 404, r.status_code
test_unknown_project_404()

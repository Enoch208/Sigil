import requests
BASE_URL = "https://sigil-umber.vercel.app"
def test_report_scores_clean_loop_100():
    r = requests.get(f"{BASE_URL}/api/l/loopscope/sigil", timeout=30)
    assert r.status_code == 200, r.status_code
    d = r.json()
    assert d["report"]["score"]["score"] == 100, d["report"]["score"]
    assert d["report"]["score"]["contradicted"] == 0, "unexpected contradiction"
test_report_scores_clean_loop_100()

import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/health", timeout=30)
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

t()

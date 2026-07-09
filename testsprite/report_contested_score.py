import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/contested", timeout=30)
    assert r.json()["report"]["score"]["score"] < 100

t()

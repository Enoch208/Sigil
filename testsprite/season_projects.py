import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/season", timeout=30)
    assert r.json()["totals"]["projects"] >= 3

t()

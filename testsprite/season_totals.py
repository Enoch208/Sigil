import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/season", timeout=30)
    t = r.json()["totals"]
    assert all(k in t for k in ("projects", "iterations", "banked", "contradicted"))

t()

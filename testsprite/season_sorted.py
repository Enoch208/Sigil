import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/season", timeout=30)
    sc = [e["score"] for e in r.json()["entries"]]
    assert sc == sorted(sc, reverse=True)

t()

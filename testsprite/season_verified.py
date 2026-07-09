import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/season", timeout=30)
    assert any(e["status"] == "verified" for e in r.json()["entries"])

t()

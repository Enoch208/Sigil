import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/sigil/badge.svg", timeout=30)
    assert "max-age=60" in r.headers.get("cache-control", "")

t()

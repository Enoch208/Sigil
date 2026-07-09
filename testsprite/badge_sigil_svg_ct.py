import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/sigil/badge.svg", timeout=30)
    assert "image/svg+xml" in r.headers.get("content-type", "")

t()

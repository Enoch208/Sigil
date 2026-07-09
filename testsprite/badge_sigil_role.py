import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/sigil/badge.svg", timeout=30)
    assert "role=" in r.text and "img" in r.text

t()

import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/sigil/badge.svg", timeout=30)
    assert "aria-label=" in r.text and "loop" in r.text

t()

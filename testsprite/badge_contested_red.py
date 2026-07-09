import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/contested/badge.svg", timeout=30)
    assert "#e5534b" in r.text

t()

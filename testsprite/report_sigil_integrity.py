import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/sigil", timeout=30)
    assert r.json()["report"]["score"]["integrity"] == 100

t()

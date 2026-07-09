import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/sigil", timeout=30)
    d = r.json()
    assert isinstance(d["report"]["verdicts"], list) and len(d["report"]["verdicts"]) == 3

t()

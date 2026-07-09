import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/loopscope/contested", timeout=30)
    d = r.json()
    assert any(v["verdict"] == "contradicted" for v in d["report"]["verdicts"])

t()

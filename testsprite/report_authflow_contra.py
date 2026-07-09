import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/nexus/authflow", timeout=30)
    assert r.json()["report"]["score"]["contradicted"] >= 1

t()

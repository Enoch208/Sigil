import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/health", timeout=30)
    c = r.json()["commit"]
    assert isinstance(c, str) and len(c) > 0

t()

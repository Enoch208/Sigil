import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/health", timeout=30)
    assert "application/json" in r.headers.get("content-type", "")

t()

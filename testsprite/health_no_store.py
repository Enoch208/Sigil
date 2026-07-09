import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/health", timeout=30)
    assert "no-store" in r.headers.get("cache-control", "")

t()

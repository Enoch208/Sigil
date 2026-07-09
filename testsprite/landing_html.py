import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/", timeout=30)
    assert "text/html" in r.headers.get("content-type", "")

t()

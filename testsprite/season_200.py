import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/season", timeout=30)
    assert r.status_code == 200

t()

import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/season", timeout=30)
    assert isinstance(r.json()["fingerprints"], list)

t()

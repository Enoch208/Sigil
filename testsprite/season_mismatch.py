import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/season", timeout=30)
    v = r.json()["verdictMismatchRate"]
    assert isinstance(v, (int, float))

t()

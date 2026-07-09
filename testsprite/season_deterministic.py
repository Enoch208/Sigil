import requests
B = "https://sigil-umber.vercel.app"

def t():
    a = [e["project"] for e in requests.get(B + "/api/season", timeout=30).json()["entries"]]
    b = [e["project"] for e in requests.get(B + "/api/season", timeout=30).json()["entries"]]
    assert a == b

t()

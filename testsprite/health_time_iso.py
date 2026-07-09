import requests
B = "https://sigil-umber.vercel.app"

def t():
    import datetime
    r = requests.get(B + "/api/health", timeout=30)
    datetime.datetime.fromisoformat(r.json()["time"].replace("Z", "+00:00"))

t()

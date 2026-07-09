import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/nexus/authflow/badge.svg", timeout=30)
    assert r.text.startswith("<svg")

t()

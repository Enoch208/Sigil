import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/%3Cscript%3E/x/badge.svg", timeout=30)
    assert r.status_code in (404, 400)

t()

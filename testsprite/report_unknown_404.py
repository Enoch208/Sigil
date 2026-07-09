import requests
B = "https://sigil-umber.vercel.app"

def t():
    r = requests.get(B + "/api/l/nobody/nothing", timeout=30)
    assert r.status_code == 404

t()

from pprint import pprint
import requests
import vars
import json
import utils
from schema.item import format_all_items
from exception.unhandled import Unhandled


class InvalidLogin(Exception):
    pass


class RequestError(Exception):
    pass


class MissingTokens(Exception):
    pass


email = "brngsas@gmail.com"
password = "kintsugiPro123"


def REQ1(email, password):
    data = {
        "email": email,
        "password": password,
        "returnSecureToken": True,
        "tenantId": vars.TENANT_ID
    }

    # res = requests.post(vars.REQ1_URL, json={
    # "email": "brngsas@gmail.com", "password": "2"})
    res = requests.post(vars.REQ1_URL, json=data)

    j = res.json()

    if res.status_code != 200:
        try:
            error = j['error']
            try:
                msg = error['message']
            except KeyError:
                raise InvalidLogin(
                    "No error message was present" + json.dumps(error))
            if msg == "MISSING_EMAIL":
                raise InvalidLogin("Email was not entered for login")
            elif msg == "INVALID_EMAIL":
                raise InvalidLogin("{} is an invalid email".format(email))
            elif msg == "MISSING_PASSWORD":
                raise InvalidLogin(
                    "Login for {}: password is missing".format(email))
            elif msg == "PASSWORD_LOGIN_DISABLED":
                raise InvalidLogin(
                    "Login for {}: Password is incorrect".format(email))
            else:
                raise Unhandled(
                    "The login response was unexpected [{}] [{}]".format(email, password), j)
        except KeyError:
            
            # no error is present
            raise RequestError("No error object was present")

    token_key = 'idToken'
    refresh_key = 'refreshToken'
    try:
        tok, refresh_token = j[token_key], j[refresh_key]
    except KeyError:
        raise MissingTokens("The idToken or refreshToken is missin")

    return tok, refresh_token


def REQ2(token):
    res = requests.post(vars.REQ2_URL, json={"idToken": token})
    j = res.json()

    print('request2 json (user info): ')
    utils.pprint(j)


def REQ3(refresh):
    url = "{}&grant_type=refresh_token&refresh_token={}".format(
        vars.REQ3_URL, refresh)
    print(url)
    res = requests.post(url)
    j = res.json()
    utils.pprint(j)
    print('request 3 ^')
    return j['access_token']


def get_cons_id(token):
    # use the token from req1 to get consigner info
    url = "https://fulltrace-server.herokuapp.com/api/consigners/YWKGcfGjC7fS4SNagTrIkPjVI2O2"
    res = requests.get(
        url, headers={"authorization": "Bearer {}".format(token)})
    j = res.json()
    return j['id']


def get_inv(cons_id, token):
    url = "https://fulltrace-server.herokuapp.com/api/inventories?location=undefined&subLocation=undefined&productId=undefined&category=&status=&search=&consigner={}&option1Value=&option2Value=&option3Value=&printed=".format(
        cons_id)
    res = requests.get(
        url, headers={"authorization": "Bearer {}".format(token)})
    j = res.json()

    return j


token, refresh = REQ1(email, password)
cons_id = get_cons_id(token)
# user_info = REQ2(token)
access_token = REQ3(refresh)

print('cons_id', cons_id)

inv = get_inv(cons_id, token)
utils.pprint(inv)
print('inventory ^')

# sales = 0
# for item in inv:
# 	if "old" in item['status']:
# 			print(item['status'])
# 			try:
# 				sales += float(item['payout'])
# 			except:
# 				print('payout', item['payout'])
# 				exit()

# print(sales, sales / 0.79)

out = format_all_items(inv)
pprint(out)
print("done")

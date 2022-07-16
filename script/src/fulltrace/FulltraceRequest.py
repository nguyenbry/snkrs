import email
from pprint import pprint
import requests
from .auth_urls import login_url, REQ3_URL, trade_token_url, consigner_data_url, inventory_url
from env import TENANT_ID
from schema.item import format_all_items
class InvalidLogin(Exception):
    pass


class RequestError(Exception):
    pass


class MissingTokens(Exception):
    pass


class Uninitialized(Exception):
    pass


class FulltraceRequest():
    def __init__(self, email, password) -> None:
        self.email = email
        self.password = password

        self.isReady = False
        self.hasObtaintedItems = False
        self.consigner_id = None
        self.items = {}

    def initialize(self):
        token, refresh = self.login()
        self.token = token

        self.get_cons_id()

        items = self.get_inv()
        formatted = format_all_items(items)
        self.items["formatted"] = formatted
        # pprint(formatted)

    def get_inv(self):
        res = requests.get(inventory_url(self.consigner_id), headers={
                           "authorization": "Bearer {}".format(self.token)})
        # TODO this can throw
        items = res.json()
        self.items["items"] = items
        self.hasObtaintedItems = True
        return items

    def get_cons_id(self):
        if self.token is None:
            raise Uninitialized("The access token has not been set")
        # use the token from req1 to get consigner info
        res = requests.get(consigner_data_url, headers={
                           "authorization": "Bearer {}".format(self.token)})

        # TODO this can throw
        j = res.json()
        out = j['id']
        self.consigner_id = out
        return

    def login(self):
        data = {
            "email": self.email,
            "password": self.password,
            "returnSecureToken": True,
            "tenantId": TENANT_ID
        }

        res = requests.post(login_url(), json=data)

        # TODO this can throw
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


R = FulltraceRequest("brngsas@gmail.com", "kintsugiPro123")
# print(R.hasObtaintedItems)
R.initialize()
# print(R.hasObtaintedItems)
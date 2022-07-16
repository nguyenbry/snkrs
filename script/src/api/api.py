from lib2to3.pgen2 import token
import requests
import json
# from exceptions import RequestError
import jwt


class RequestError(Exception):
    def __init__(self, message=None):
        super().__init__(message)


class API():
    def __init__(self, BASE_URL, email=None, password=None) -> None:
        self.base = BASE_URL
        self.email = email
        self.password = password
        self.token = None
        pass

    def get_json(self, res):
        if res.ok:
            return res.json()
        else:
            try:
                raise RequestError(json.dumps(res.json(), indent=2))
            except:
                raise RequestError("Could not get the json error to display")

    def get_headers(self):
        return {"authorization": f"Bearer {self.token}"}

    def get_full_path(self, path):
        self.validate_path(path)
        return self.base + path

    def login(self):
        if not self.email:
            raise ValueError(
                "Cannot log in. Email not provided during API instantiation")

        res = self.post(
            '/login', data={"email": self.email, "password": self.password})
        token = res.json()['accessToken']
        decoded = jwt.decode(token, options={"verify_signature": False})
        print('decoded', decoded)
        self.token = token

    def validate_path(self, path):
        if path is None or path[0] != "/":
            raise ValueError(f"Path provided ({path}) is incorrect.")

    def put(self, path):
        return requests.put(self.get_full_path(path))

    def get(self, path, auth=False):
        return requests.get(self.get_full_path(path), headers=self.get_headers() if auth else {})

    def post(self, path, data=None):
        data_type = type(data)
        url = self.get_full_path(path)
        if data_type == dict:
            return requests.post(url, json=data)
        elif data_type == str:
            return requests.post(url, json=json.loads(data))
        else:
            return requests.post(url)

    def delete(self, path):
        return requests.delete(self.get_full_path(path))

    def get_consigner_items(self, consId):
        res = self.get(f"/items/{consId}", auth=True)
        return self.get_json(res)

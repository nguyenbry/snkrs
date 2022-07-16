import os
from .api import API

# TODO, FOR PRODUCTION edit these on server provider
URL_ENV_KEY = "API_BASE_URL"
BASE_URL = os.environ.get(URL_ENV_KEY) or "http://localhost:4000"
ADMIN_EMAIL = os.environ.get("email") or "brngsas@gmail.com"
ADMIN_PW = os.environ.get("password") or "polpol09"

admin_api = API(BASE_URL, email=ADMIN_EMAIL, password=ADMIN_PW)
admin_api.login()

class AdminAPI(API):
  def __init__(self, BASE_URL, email=None, password=None) -> None:
    super().__init__(BASE_URL, email, password)
    
  # define things that only the Admin can do
  def get_all_users(self):
    res = self.get('/users')
    return self.get_json(res)

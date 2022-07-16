import json
from src.fulltrace.FulltraceRequest import FulltraceRequest
from src.api.admin_api import admin_api
import json
from src.utils.data_explorer import explore_all_values_of_keys
import threading
from datetime import datetime
from src.utils.utils import save_json
from src.api.admin_api import admin_api


def get_users():
    return [
        {"email": "brngsas@gmail.com", "password": "kintsugiPro123"},
        {"email": "kouroshf08@gmail.com", "password": "Kourosh11!"},
        {"email": "ttv.hellobb2@gmail.com", "password": "La*81F$5"},
        {"email": "Keshavamitsharma@gmail.com", "password": "Keshav12!"},
        {"email": "badguystan@gmail.com", "password": "Carnage661$"},
        {"email": "chenfranklin09@gmail.com", "password": "Basketball123!"}
    ]
    




# # users = get_users()

# # location can be null
# # stockxpath can be null
# # non_null = ["itemId", "code", "size", "location", "status",
# #             "consignerId", "productId", "title", "sku", "stockxPath"]

# # explore = []


# def run(user):
#     email = user['email']
#     pw = user['password']
#     fulltrace_req = FulltraceRequest(email, pw)
#     fulltrace_req.initialize()

#     items = fulltrace_req.items['formatted']
#     return items


# # get all the users
# users = get_users()


# for user in users:
#     items = run(user)

#     # print(items)

#     consignerId = items[0]['consignerId']
#     consigner_items = admin_api.get_consigner_items(consignerId)
#     print('consigner items', consigner_items)
#     break



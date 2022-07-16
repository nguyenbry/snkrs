import env


def login_url():
    return "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key={}".format(env.GOOGLE_API_KEY)


def trade_token_url(GOOGLE_API_KEY):
    return "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key={}".format(env.GOOGLE_API_KEY)


def REQ3_URL(GOOGLE_API_KEY):
    return "https://securetoken.googleapis.com/v1/token?key={}".format(env.GOOGLE_API_KEY)


consigner_data_url = "https://fulltrace-server.herokuapp.com/api/consigners/YWKGcfGjC7fS4SNagTrIkPjVI2O2"


def inventory_url(cons_id):
    return "https://fulltrace-server.herokuapp.com/api/inventories?location=undefined&subLocation=undefined&productId=undefined&category=&status=&search=&consigner={}&option1Value=&option2Value=&option3Value=&printed=".format(cons_id)

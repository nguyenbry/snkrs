from json import dumps

class Unhandled(Exception):
    discord_wh_url = ""

    def __init__(self, msg, data=None):
        # super().__init__(args)
        self.msg = msg
        self.data = None

    def __str__(self):
        out = {
            "message": self.msg,
            "data": self.data
        }
        return dumps(out, indent=2)

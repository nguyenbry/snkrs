from multiprocessing.sharedctypes import Value
from json import dumps
import re


class InvalidItemStatus(Exception):
    def __init__(self, message=None):
        super().__init__(message)


def numericalize(strr):
    reg = r'[\d.]+'
    match = re.match(reg, strr)
    if match is None:
        # print(strr, 'match is none')
        return strr
    else:
        # print(strr, 'match is some')
        return match.group()


def size(strr):
    strr = strr.split('/')[0].strip()
    if ".0" in strr:
        strr = strr.replace('.0', '')

    return numericalize(strr)


def normalize_stockx_data(d):
    out = {}
    for key, item in d.items():
        out[normalize_size_str(key)] = item
    return out

statuses = [
    {
        "regex": r"[sS][oO][lL][dD]",
        "value": "sold"
    },
    {
        "regex": r"[aA][cC][tT][iI][vV][eE]",
        "value": "active"
    },
    {
        "regex": r"([pP][aA][iI][dD])|[pP][aA][yY]",
        "value": "paid"
    },
    {
        "regex": r"[pP][eE][nN][dD][iI][nN][gG]",
        "value": "pending"
    }
]


def status(item):
    status = item['status']
    if status is None:
        raise InvalidItemStatus(f"Status was null {dumps(item, indent=2)}")

    for o in statuses:
        r = o['regex']
        status_value = o['value']

        match = re.search(r, status)
        if match:
            return status_value

    raise InvalidItemStatus(f"Status is unexpected {dumps(item, indent=2)}")


def format_item(item):
    pass


def format_items(items):
    return [format_item(i) for i in items]

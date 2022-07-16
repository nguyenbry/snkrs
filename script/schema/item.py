import json


class ValidationError(Exception):
    def __init__(self, message=None):
        super().__init__(message)


def transform_price(price):
    price_type = type(price)
    if price_type == float:
        return round(price, 2)
    if price_type == int:
        return round(float(price), 2)

    if price_type == str:
        return round(float(price.strip()), 2)


def format_item(item):
    transform_options = [
        {
            "key": "id",
            "savekey": "itemId",
            "validate": lambda x: type(x) == int
        },
        {
            "key": "code",
            "savekey": "code",
            "validate": lambda x: type(x) == str
        },
        {
            "key": "option1Value",
            "savekey": "size",
            "validate": lambda x: type(x) == str or x is None
        },
        {
            "key": "location",
            "savekey": "location",
            "validate": lambda x: type(x) == str or x is None
        },
        {
            "key": "price",
            "savekey": "price",
            "transform": transform_price
        },
        {
            "key": "payout",
            "savekey": "payout",
            "transform": transform_price
        },
        {
            "key": "status",
            "savekey": "status",
            "validate": lambda x: type(x) == str
        },
        {
            "key": "acceptedOn",
            "savekey": "acceptedAt",
            "validate": lambda x: x is not None
        },
        {
            "key": "consignerId",
            "savekey": "consignerId",
            "transform": lambda id_: int(id_),
        },
    ]

    unwind = [
        {
            "key": "product",
            "transform": [
                {
                    "key": "id",
                    "savekey": "productId"
                },
                {
                    "key": "title",
                },
                {
                    "key": "sku",
                },
                {
                    "key": "stockXHandle",
                    "savekey": "stockxPath"
                },
            ]
        },
        {
            "key": "consigner",
            "transform": [
                {
                    "key": "id",
                    "savekey": "consignerId"
                }
            ]
        }
    ]
    out = {}

    for t in transform_options:
        og_value = t['key']
        new_key = t['savekey']
        value = item[og_value]
        # custom validation
        try:
            validate_func = t['validate']
            if not validate_func(value):
                raise ValidationError(f"{og_value}: {value}")
        except:
            # no validator exists
            pass

        try:
            transform_func = t['transform']
            out[new_key] = transform_func(value)
        except KeyError:
            out[new_key] = value

    for u in unwind:
        unwind_key = u['key']
        for t in u['transform']:
            og_value = t['key']
            try:
                new_key = t['savekey']
            except KeyError:
                new_key = og_value

            value = item[unwind_key][og_value]

            try:
                transform_func = t['transform']
                out[new_key] = transform_func(value)
            except KeyError:
                out[new_key] = value
    return out

# this should be the only function used for the most part


def format_all_items(items):
    return list(map(format_item, items))

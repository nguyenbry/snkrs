from json import loads, dumps


def explore_all_values_of_keys(list_of_dicts, keys, print_=False):
    out = dict()

    for k in keys:
        out[k] = {}

    for item in list_of_dicts:
        for k in keys:
            value = item[k]

            try:
                out[k][value] = out[k][value] + 1
            except KeyError:
                out[k][value] = 1
    if print_:
        print(dumps(out, indent=2))
    return out

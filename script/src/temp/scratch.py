from cmath import exp
import re

r = r"[pP][eE][nN][dD][iI][nN][gG]"
possible = [" pending ", "pending", " Pending ",
            "   ^ pending", " 389nPenDing eef", "sold "]

out = []

for v in possible:
    found = re.search(r, v)
    if found:
        out.append(True)
    else:
        out.append(False)

for actual, expected in zip(out, [True, True, True, True, True, False]):
    assert actual == expected

# print(out)

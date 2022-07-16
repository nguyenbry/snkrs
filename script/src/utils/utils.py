import json

def pprint(data):
  print(json.dumps(data, indent=2))
  
def save_json(j, filename):
  with open(filename, 'w+') as file:
    file.write(json.dumps(j, indent=2))
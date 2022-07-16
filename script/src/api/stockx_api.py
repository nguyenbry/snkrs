import requests
import json


class NoResults(Exception):
    def __init__(self, message=None):
        super().__init__(message)


def get_size_data(stockx_link):
    # print(stockx_link)
    product_url = f'https://stockx.com/{stockx_link}'
    stockx_link = f"https://stockx.com/api/products/{stockx_link}?includes=market,360&currency=USD&country=US"
    headers = {
        "cookie": "__cfduid=d7df59dec26df12d5b52f6a140df42d1e1615540427",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, "
                      "like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    }
    # making the request for the stockx data
    response_dict = requests.get(stockx_link, headers=headers)
    # print(response_dict.content)
    response_dict = response_dict.json()
    try:
        market, children = response_dict['Product']['market'], response_dict['Product']['children']
    except KeyError:
        with open('error.json', 'w+') as file:
            file.write(json.dumps(response_dict))
        exit(-1)

    data = {
            'url': product_url,
            'title': response_dict['Product']['title'],
            # 'salesLast3Days': market['salesLast72Hours'],
            # 'lastSaleSize': market['lastSaleSize'],
            # 'lastSalePrice': market['lastSale'],
            # 'numberOfBids': market['numberOfBids'],
            # 'numberOfAsks': market['numberOfAsks'],
            'overallLowestAsk': market['lowestAsk'],
            'overallHighestBid': market['highestBid'],
        }
    # not all items have SKUs
    try:
        sku = response_dict['Product']['styleId']
        
        sku_type = type(sku)
        if sku_type == str:
            data['sku'] = sku
        elif sku_type == list:
            data['sku'] = "/".join(sku)
        elif sku is None:
            data['sku'] = None
        else:
            raise ValueError
    except KeyError:
        pass
    try:
        data['retail'] = response_dict['Product']['retailPrice']
    except KeyError:
        pass
    try:
        data['releaseDate'] = response_dict['Product']['releaseDate']
    except KeyError:
        pass
    # constructing the size/prices data
    sizes = {}
    for key in children.keys():
        child = children[key]
        market = child['market']
        try:
            size_obj = {
                'lowest_ask': market['lowestAsk'], 'highest_bid': market['highestBid']}
        except KeyError:
            print(json.dumps(market, indent=2))
        sizes[(child['shoeSize'])] = size_obj

    data['sizes'] = sizes
    return data


class StockXAPI:
    def __init__(self):
        with open('stockx.json', 'r') as file:
            data = json.loads(file.read())
            self.algolia_url = data['algoliaUrl']
            self.algolia_api_key = data['algoliaApiKey']
            self.algolia_app_id = data['algoliaAppId']

    def get_query_hits(self, query):
        request_body = f'{{"query":"{query}","facets":"*","filters":""}}'
        algolia_headers = {'x-algolia-api-key': self.algolia_api_key,
                           'x-algolia-application-id': self.algolia_app_id}
        res = requests.post(
            self.algolia_url, data=request_body, headers=algolia_headers)
        j = res.json()
        hits = j['hits']

        if len(hits) == 0:
            raise NoResults(f"No results for [{query}]")
        return hits

    def get_data(self, query=None, url=None):
        if query:
            hits = self.get_query_hits(query)
            if not hits:
                return {}

            hit = hits[0]
            
            data = get_size_data(hit['url'])
            data['img'] = hit['thumbnail_url']
            return data
        if url:
            hits = self.get_query_hits(url)
            if not hits:
                return {}

            hit = hits[0]
            
            found_url = hit['url']
            
            if found_url not in url or url not in found_url:
                raise NoResults(f"Searched for url [{url}] and got [{found_url}]")
            
            data = get_size_data(hit['url'])
            data['img'] = hit['thumbnail_url']
            return data


s = StockXAPI()

# hits = s.get_query_hits('Jordan 1 Mid SE White Pine Green Smoke Grey (GS)')
# hit = hits[0]
# name = hit['name']
# url = hit['url']
# sku = hit['style_id']
hit = s.get_data(url='moutain-dew-pitch-black-bottle')

# print(name, url, sku)
# data = s.get_data_for_sku()
print(json.dumps(hit, indent=2))
print(hit.keys())

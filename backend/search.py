import datetime
import logging
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Callable, NamedTuple, Optional

import requests
from bs4 import BeautifulSoup

import ebay
from _types import Product

THREAD_POOL = 16
session = requests.Session()
session.mount(
    'https://',
    requests.adapters.HTTPAdapter(pool_maxsize=THREAD_POOL,
                                  max_retries=2,
                                  pool_block=True)
)

BING_API_KEY = os.environ.get("BING_API_KEY")

assert BING_API_KEY != None, "Bing api key not defined!"

BING_API_URL = 'https://api.bing.microsoft.com/v7.0'

SITE_TO_SPECIFIER = {
    "ebay": "www.ebay.com/itm",
    "offerup": "offerup.com",
    "wayfair": "www.wayfair.com",
    "amazon": "www.amazon.comm",
    "alibaba": "www.alibaba.com/product-detail",
    "facebook":"www.facebook.com/marketplace",
    "etsy": "www.etsy.com/listing",
    "craigslist": "miami.craigslist.org",
    "mercari": "www.mercari.com/us/item",
    "temu": "www.temu.com",
    "walmart": "www.walmart.com/ip",
    "bestbuy": "www.bestbuy.com/site",
    "reverb": "reverb.com/item",
    "ikea": "www.ikea.com",
    "depot": "www.homedepot.com/p",
}


Scrapper = Callable[[BeautifulSoup, str], "Product"]
SITE_TO_SCRAPPER = {
    "ebay": ebay.scrape_w_soup,
    "offerup": None,
    "wayfair": None,
    "amazon": None,
    "alibaba": None,
    "facebook": None,
    "etsy": None,
    "craigslist": None,
    "mercari": None,
    "temu": None,
    "walmart": None,
    "bestbuy": None,
    "reverb": None,
    "ikea": None,
    "depot": None,
}

class SiteSearch(NamedTuple):
    cached_url: str
    url: str
    cached_at: datetime.datetime

def text_search_url(site_url: str, query: str, n_results = 15) -> list[SiteSearch]:
    """Searches Bing for a given site with a query,
    Returns a list of SiteSearches with contains simplified information about the results

    Meant to be scraped later
    """

    search = f"site:{site_url} {query}"

    params = {
        "q": search,
        "mkt": "en-US",
        "freshness": "month",
        "count": str(n_results),
    }
    headers = {
        "Ocp-Apim-Subscription-Key": BING_API_KEY
    }

    print("test")

    res = session.get(f"{BING_API_URL}/search", headers=headers, params=params)
    try:
        res.raise_for_status()
    except Exception as e:
        logging.warning(f"An error occurred when searching for {query}")
        return []

    data = res.json()
    with open("tmp.json", "w") as f:
        f.write(res.text)


    pages = data["webPages"]["value"]

    urls = [
        SiteSearch(
            p.get('cachedPageUrl'),
            p.get('url'),
            datetime.datetime.fromisoformat(cachedAt) if (cachedAt:= p.get("dateLastCrawled")) else None
        )
        for p in pages
    ]

    return urls

def text_search_all(query: str) -> list[Product]:
    def _search(data: tuple[str, str]):
        product_url, specifier = data
        return [product
                for product in search_and_scrape(product_url, query, SITE_TO_SCRAPPER[specifier])]

    with ThreadPoolExecutor(max_workers=15) as exector:
        return [product
                for results in exector.map(_search, SITE_TO_SPECIFIER.items())
                    for product in results
                ]

def search_and_scrape(site_product_url: str, query: str ,scraper: Scrapper) -> list[Product]:
    urls_to_scrape = text_search_url(site_product_url, query)
    def _scrape(siteSearch: SiteSearch) -> Optional[Product]:
        cached_url, url, lastUpdated = siteSearch
        req = session.get(url)
        if 400 <= req.status_code < 600:
            # The request it not ok
            return None
        product = scraper(BeautifulSoup(req.text, "lxml"), cached_url)
        product["lastUpdatedAt"] = lastUpdated
        product["url"] = url
        return product

    with ThreadPoolExecutor(max_workers=THREAD_POOL) as executor:
        return [product
                for product in executor.map(_scrape, urls_to_scrape)]

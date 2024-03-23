import datetime
import logging
import os
from tarfile import AbsoluteLinkError
from typing import NamedTuple

import requests

import ebay
from _types import Product

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


SITE_TO_SCRAPPER = {
    "ebay": ebay.scrape,
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

def text_search_url(site_url: str, query: str, n_results = 20) -> list[SiteSearch]:
    """Searches Bing for a given site with a query,
    Returns a list of SiteSearches with contains simplified information about the results

    Meant to be scraped later
    """

    search = f"site:{site_url} {query}"

    params = {
        "q": search,
        "mkt": "en-US",
        "freshness": "Week",
        "count": str(n_results),
    }
    headers = {
        "Ocp-Apim-Subscription-Key": BING_API_KEY
    }

    res = requests.get(f"{BING_API_URL}/search", headers=headers, params=params)
    try:
        res.raise_for_status()
    except Exception as e:
        logging.warning(f"An error occurred when searching for {query}")
        return []

    data = res.json()
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
    products = []

    for specifier, site_product_url in SITE_TO_SPECIFIER.items():
        scrapper = SITE_TO_SCRAPPER[specifier]
        if not scrapper: continue

        urls_to_scrape = text_search_url(site_product_url, query)
        for cached_url, url, lastUpdated in urls_to_scrape:
            product: Product = scrapper(cached_url)
            if product == None: continue

            product["lastUpdatedAt"] = lastUpdated
            product["url"] = url
            products.append(product)

    return products

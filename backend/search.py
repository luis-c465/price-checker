import datetime
import logging
import os
from concurrent.futures import ThreadPoolExecutor
from random import randint
from typing import Callable, Literal, NamedTuple, Optional, TypedDict

import requests
from bs4 import BeautifulSoup
from pyuploadcare import Uploadcare
from serpapi import GoogleSearch
from werkzeug.datastructures.file_storage import FileStorage

import amazon
import ebay
from _types import Product

SERP_API_KEYS = {
    key: True
    for i in range(1, 10)
        if (key := os.environ.get(f"SERP_API_{i}")) != None
}

UPLOAD_CARE_PUBLIC_KEY = os.environ.get("UPLOAD_CARE_PUBLIC_KEY")
assert UPLOAD_CARE_PUBLIC_KEY != None, "Upload care public key not found!"

uploadcare = Uploadcare(public_key=UPLOAD_CARE_PUBLIC_KEY, secret_key="YOUR_SECRET_KEY")

THREAD_POOL = 16
session = requests.Session()
session.mount(
    "https://",
    requests.adapters.HTTPAdapter(
        pool_maxsize=THREAD_POOL, max_retries=2, pool_block=True
    ),
)

BING_API_KEY = os.environ.get("BING_API_KEY")

assert BING_API_KEY != None, "Bing api key not defined!"

BING_API_URL = "https://api.bing.microsoft.com/v7.0"

Scrapper = Callable[[BeautifulSoup, str], "Product"]


class ImageProductSearch(TypedDict):
    text: str
    url: str


class ConstantSiteData(TypedDict):
    url: str
    scraper: Scrapper
    allowedFreshness: Literal["month"] | Literal["week"] | Literal["day"] | None
    logo: str


SITE_SPECIFIER_TO_DATA: dict[str, ConstantSiteData] = {
    "ebay": {
        "logo": "ebay",
        "url": "www.ebay.com/itm",
        "scraper": ebay.scrape_w_soup,
        "allowedFreshness": "month",
    },
    # "offerup": {
    #     "logo": "offerup",
    #     "url": "offerup.com", "scraper": None, "allowedFreshness": None},
    # "wayfair": {"url": "www.wayfair.com", "scraper": None, "allowedFreshness": None},
    "amazon": {
        "logo": "amazon",
        "url": "www.amazon.com",
        "scraper": amazon.scrape_w_soup,
        "allowedFreshness": None,
    },
    # "alibaba": {
    #     "url": "www.alibaba.com/product-detail",
    #     "scraper": None,
    #     "allowedFreshness": None,
    # },
    "facebook": {
        "logo": "facebook marketplace",
        "url": "www.facebook.com/marketplace",
        "scraper": None,
        "allowedFreshness": None,
    },
    # "etsy": {"url": "www.etsy.com/listing", "scraper": None, "allowedFreshness": None},
    # "craigslist": {
    #     "url": "miami.craigslist.org",
    #     "scraper": None,
    #     "allowedFreshness": None,
    # },
    # "mercari": {
    #     "url": "www.mercari.com/us/item",
    #     "scraper": None,
    #     "allowedFreshness": None,
    # },
    # "temu": {"url": "www.temu.com", "scraper": None, "allowedFreshness": None},
    "walmart": {
        "logo": "walmart",
        "url": "www.walmart.com/ip", "scraper": None, "allowedFreshness": None},
    # "bestbuy": {
    #     "url": "www.bestbuy.com/site",
    #     "scraper": None,
    #     "allowedFreshness": None,
    # },
    # "reverb": {"url": "reverb.com/item", "scraper": None, "allowedFreshness": None},
    # "ikea": {"url": "www.ikea.com", "scraper": None, "allowedFreshness": None},
    "depot": {
        "logo": "homedepot",
        "url": "www.homedepot.com/p", "scraper": None, "allowedFreshness": None},
}


class SiteSearch(NamedTuple):
    cached_url: str
    url: str
    cached_at: datetime.datetime


def text_search_url(
    site_data: ConstantSiteData, query: str, n_results=8
) -> list[SiteSearch]:
    """Searches Bing for a given site with a query,
    Returns a list of SiteSearches with contains simplified information about the results

    Meant to be scraped later
    """

    search = f"site:{site_data['url']} {query}"

    params = {
        "q": search,
        "count": str(n_results),
        "answerCount": n_results,
        "promote": "Webpages",
        "safeSearch": "Off",
    }
    if site_data["allowedFreshness"] != None:
        params["freshness"] = site_data["allowedFreshness"]

    headers = {"Ocp-Apim-Subscription-Key": BING_API_KEY}

    res = session.get(f"{BING_API_URL}/search", headers=headers, params=params)
    try:
        res.raise_for_status()
    except Exception as e:
        logging.warning(f"An error occurred when searching for {query}")
        return []

    data: dict = res.json()
    with open("tmp.json", "w") as f:
        f.write(res.text)

    if (web_pages := data.get("webPages", None)) == None or (
        pages := web_pages.get("value", None)
    ) == None:
        logging.error(
            f"Hey something has gone horribly wrong here, When searching for {search}, there were no webPages returned"
        )
        return []

    urls = [
        SiteSearch(
            p.get("cachedPageUrl"),
            p.get("url"),
            (
                datetime.datetime.fromisoformat(cachedAt)
                if (cachedAt := p.get("dateLastCrawled"))
                else None
            ),
        )
        for p in pages
    ]

    return urls


def text_search_all(query: str) -> list[Product]:
    def _search(data: ConstantSiteData):
        if data["scraper"] is None:
            return []
        return [product for product in search_and_scrape(data, query)]

    with ThreadPoolExecutor(max_workers=15) as exector:
        return [
            product
            for results in exector.map(_search, SITE_SPECIFIER_TO_DATA.values())
            for product in results
        ]


def search_and_scrape(site_data: ConstantSiteData, query: str) -> list[Product]:
    print(site_data)
    urls_to_scrape = text_search_url(site_data, query)

    def _scrape(siteSearch: SiteSearch) -> Optional[Product]:
        cached_url, url, lastUpdated = siteSearch
        req = session.get(url)
        if 400 <= req.status_code < 600:
            # The request it not ok
            return None
        product = site_data["scraper"](BeautifulSoup(req.text, "lxml"), cached_url)
        product["lastUpdatedAt"] = lastUpdated
        product["url"] = url
        product["logo"] = site_data["logo"]
        return product

    with ThreadPoolExecutor(max_workers=THREAD_POOL) as executor:
        return [product
                for product in executor.map(_scrape, urls_to_scrape)
                    if product != None]


def images_search_all(files: list[FileStorage]) -> list[ImageProductSearch]:
    with ThreadPoolExecutor(max_workers=15) as exector:
        return [
            data
            for results in exector.map(image_search_single, files)
                for data in results
                    if data is not None
        ]


def image_search_single(file: FileStorage) -> list[ImageProductSearch]:
    file_obj = None
    file_path = f"tmp/{file.name}{randint(1, 999)}.jpg"
    file.save(file_path)

    try:
        with open(file_path, "rb") as f:
            file_obj = uploadcare.upload(f)
    except Exception as e:
        logging.warning("There was an error while uploading the image")
        logging.error(e)

    for i, (KEY, works) in enumerate(SERP_API_KEYS.items()):
        try:
            if not works: continue

            serp_params = {
                "api_key": KEY,
                "engine": "google_lens",
                "url": file_obj.cdn_url
            }

            search = GoogleSearch(serp_params)
            results = search.get_dict()

            visual_matches = results.get("visual_matches")
            if not visual_matches:
                logging.info(f"No visual matches for key #{i}")
                continue

            return [
                {"text": m.get("title", None), "url": m.get("thumbnail", None)}
                    for m in visual_matches
                        if m != None
            ]
        except Exception:
            SERP_API_KEYS[KEY] = False

    logging.warning("All the serp api keys failed!")
    return []

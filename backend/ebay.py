import logging
from asyncio import Condition
from typing import Optional

import requests
from bs4 import BeautifulSoup

from _types import Condition, PossibleProduct, Product
from util import make_product_dict


def scrape(url: str) -> PossibleProduct:
    req = requests.get(url)
    if 400 <= req.status_code < 600:
        # The request it not ok
        return None

    html = req.text
    page = BeautifulSoup(html, "html.parser")
    return scrape_w_soup(page)


def scrape_w_soup(page: BeautifulSoup, url: str) -> PossibleProduct:
    """Takes in an already scraped and parsed page, and extracts the information

    Used separately for testing from already fetched pages
    """
    product_info = make_product_dict()

    if price := _price(page, url):
        product_info["price"] = price

    if condition := _condition(page, url):
        product_info["condition"] = condition

    if (shipping := _shipping(page, url)) != None:
        product_info["shipping"] = shipping

    if photos := _photos(page, url):
        product_info["photos"] = photos

    if seller_num_ratings := _seller_num_ratings(page, url):
        product_info["seller_num_ratings"] = seller_num_ratings

    if seller_avg_ratings := _seller_avg_ratings(page, url):
        product_info["seller_avg_ratings"] = seller_avg_ratings

    if quantity := _quantity(page, url):
        product_info["quantity"] = quantity

    if description := _description(page, url):
        product_info["description"] = description

    return product_info


def _price(page: BeautifulSoup, url: str) -> Optional[float]:
    price_elm = page.select_one(".x-price-primary")
    if price_elm == None:
        logging.warning(f"@{url} price element not found")
        return None

    price_txt = price_elm.text
    if len(price_txt) == 0:
        logging.warning(f"@{url} price text is empty")
        return None

    # Split the text string by the dolor sign
    splices = price_txt.split("$", 1)
    if len(splices) != 2:
        logging.warning(f"@{url} price text '{price_txt}' does not have a '$', or formatted badly")
        return None

    try:
        return float(splices[1].replace(",", ""))
    except ValueError:
        logging.warning(f"@{url} price '{splices[1]}' is not a float or formatted badly")
        return None

def _condition(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one(".x-item-condition-text .clipped")
    if elm == None:
        logging.warning(f"@{url} condition element not found")
        return None

    condition_txt = elm.text
    if len(condition_txt) == 0:
        logging.warning(f"@{url}: condition is empty")
        return None

    return condition_txt

def _shipping(page: BeautifulSoup, url: str) -> Optional[float]:
    elm = page.select_one(".d-shipping-minview .ux-labels-values__values-content .ux-textspans--BOLD")
    if elm == None:
        logging.warning(f"@{url} shipping element not found")
        return None

    txt = elm.text
    if len(txt) == 0:
        logging.warning(f"@{url}: price is empty")
        return None

    if "free" in txt.lower():
        return 0

    # Split the text string by the dolor sign
    splices = txt.split("$", 1)
    if len(splices) != 2:
        logging.warning(f"@{url} shipping price text '{txt}' does not have a '$', or formatted badly")
        return None

    try:
        return float(splices[1])
    except ValueError:
        logging.warning(f"@{url} shipping price splice '{splices[1]}' is not a float or formatted badly")
        return None

def _condition(page: BeautifulSoup, url:str) -> Optional[Condition]:
    elm = page.select_one(".x-item-condition-text .clipped")
    if elm == None:
        logging.warning(f"@{url} condition element not found")
        return None

    txt = elm.text.lower()
    if len(txt) == 0:
        logging.warning(f"@{url}: condition is empty")
        return None

    if txt == "new":
        return Condition.NEW
    else:
        return Condition.USED

def _photos(page: BeautifulSoup, url: str) -> Optional[list[str]]:
    elms = page.select(".x-photos-min-view .ux-image-carousel-container .ux-image-carousel-item > img", limit=3)
    if elms == None or len(elms) == 0:
        logging.warning(f"@{url} images not found")
        return None

    return [img for elm in elms if (img := elm.get("data-zoom-src", default=None))]

def _seller_num_ratings(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one(".x-sellercard-atf__about-seller")
    if elm == None:
        logging.warning(f"@{url} number of seller ratings not found")
        return None

    txt = elm.text
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} number of seller ratings text invalid")
        return None

    int_part = txt[1:len(txt) - 1]
    try:
        return int(int_part)
    except ValueError:
        logging.warning(f"@{url} number of seller ratings '{int_part}' is not an int")
        return None

def _seller_avg_ratings(page: BeautifulSoup, url:str) -> Optional[int]:
    elm = page.select_one(".x-sellercard-atf__data-item-wrapper > li")
    if elm == None:
        logging.warning(f"@{url} avg seller rating not found")
        return None

    txt = elm.text
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} number of seller ratings text invalid")
        return None

    splits = txt.split("%", maxsplit=1)
    if len(splits) != 2:
        logging.warning(f"@{url} the number of splits in '{txt} is not 2'")
        return None

    rating_part = splits[0]
    try:
        return round(float(rating_part), ndigits=None)
    except ValueError:
        logging.warning(f"@{url} avg seller ratings '{rating_part}' is not an int")
        return None

def _quantity(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one(".d-quantity__availability span")

    # If the availability element does not exist, then it is assumed there is only
    # one for sale
    if elm == None:
        return 1

    txt = elm.text
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} availability is empty")
        return None

    splits = txt.split(" ", maxsplit=1)
    if len(splits) != 2:
        logging.warning(f"@{url} the number of splits in '{txt}' is not 2")
        return None

    quantity_part = splits[0]
    try:
        return int(quantity_part)
    except ValueError:
        logging.warning(f"@{url} quantity '{quantity_part}' is not an int")
        return None

def _description(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one("meta[name='description']")

    if elm == None:
        logging.warning(f"@{url} description not found")
        return None

    txt = elm.get("content", None)
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} description is empty")
        return None

    return txt



if __name__ == "__main__":
    datas = [
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4913893931419139&mkt=en-US&setlang=en-US&w=ZcbZ_2mVcLG6lKBo1_1rowRMhZNrwJ5",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4795047900025403&mkt=en-US&setlang=en-US&w=caEtLMGIDTiEiQcoQ0ZDbPluH8KQA1Bg",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4824988098436697&mkt=en-US&setlang=en-US&w=So8KJm8BPvGSJpWjqTFkpZm7L4afZJDD",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4514328827136716&mkt=en-US&setlang=en-US&w=DqoP_oSNcycE4VdPBIxZjrmAyDyYV4KA",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4515389688202427&mkt=en-US&setlang=en-US&w=ZXXhe6SHG5AFXL5z3TsaqG8j77eS7vF5",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4727573960476552&mkt=en-US&setlang=en-US&w=e-RpUX4uNhhl2jc4XZ0m2nPj_ZnK2OnB",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4772134247750876&mkt=en-US&setlang=en-US&w=Hi3pWifhMRF6HeTsioUMEPIiZDiW68md",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4607259043386945&mkt=en-US&setlang=en-US&w=iPhoj4G62eMvI8OfLB4Tg-Kpth-Dz1Kd",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4582541500486721&mkt=en-US&setlang=en-US&w=tt6fDqB045Qj5g3tpcG8gpv34bwWugug",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4902254567361176&mkt=en-US&setlang=en-US&w=DUgviep1-Wy1SYYY6P6SfaLSSbhtwppE",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4658068496125316&mkt=en-US&setlang=en-US&w=0NQOZldVUIlGPpYbr41eolFER5eFUQvO",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4511945120423147&mkt=en-US&setlang=en-US&w=-w5N2G4mQxwDy4e_XmZ8jABCJVvj1aNT",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4996911357039803&mkt=en-US&setlang=en-US&w=rtVn-FMBO2HgVRyojQU9QIrBNgugkRq6",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=5004680947715520&mkt=en-US&setlang=en-US&w=fzgivCt4s7Pj3dAneViQJ7y61hYpra1L",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4513031752389479&mkt=en-US&setlang=en-US&w=K4kWJ2url6EESiUduzdUli03_FjAfxGy",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4859996388463191&mkt=en-US&setlang=en-US&w=grdQPM20vfyiEn0Il7TE9XE6r00oFoQD",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4865781715258121&mkt=en-US&setlang=en-US&w=ZySlGN-LKAiks-HlUr0n3KvKRE59e1BC",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4800227621168366&mkt=en-US&setlang=en-US&w=RXHpgq4dDl-G5DakrWjF0xYkj2XzdJnd",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4908056728764630&mkt=en-US&setlang=en-US&w=0IcYiRI1gA637S_8H8x0IAMMfawJH3Vj",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4952166391765118&mkt=en-US&setlang=en-US&w=yt6yDfkQ1A3L_GWk7NYCeKx8yzNSv6Rr",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4558347944147433&mkt=en-US&setlang=en-US&w=wzXrZH5vJZkY5bM-KCUpYur6nDL4pruE",
  "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4663115084738362&mkt=en-US&setlang=en-US&w=56McJ13jJA5IiihoQvG-umyEha1xTJxR"
    ]

    for data in datas:
        output = scrape(data)
        print(output)


[
  {
    "url": "https://www.ebay.com/itm/256425139871",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4913893931419139&mkt=en-US&setlang=en-US&w=ZcbZ_2mVcLG6lKBo1_1rowRMhZNrwJ5",
    "dateLastCrawled": "2024-02-28T16:01:00.0000000Z",
    "name": "Apple MacBook Pro 16\" (512GB SSD, M1 Pro, 16GB) Laptop - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/133945749355",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4795047900025403&mkt=en-US&setlang=en-US&w=caEtLMGIDTiEiQcoQ0ZDbPluH8KQA1Bg",
    "dateLastCrawled": "2023-12-15T04:24:00.0000000Z",
    "name": "Apple MacBook Pro 16\" M1 Pro Chip 16GB 512GB SSD Space Gray ... - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/305232162817",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4824988098436697&mkt=en-US&setlang=en-US&w=So8KJm8BPvGSJpWjqTFkpZm7L4afZJDD",
    "dateLastCrawled": "2023-12-31T12:42:00.0000000Z",
    "name": "Apple MacBook Pro 2021 16in M1 Pro 10 CPU 16 GPU 16GB RAM 512GB ... - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/226014754011",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4514328827136716&mkt=en-US&setlang=en-US&w=DqoP_oSNcycE4VdPBIxZjrmAyDyYV4KA",
    "dateLastCrawled": "2024-03-06T23:01:00.0000000Z",
    "name": "Apple Macbook Pro 2021 M1 Pro 3.2GHz 16GB 512GB SSD 16\" 16-Core GPU - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/166561111069",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4515389688202427&mkt=en-US&setlang=en-US&w=ZXXhe6SHG5AFXL5z3TsaqG8j77eS7vF5",
    "dateLastCrawled": "2024-01-23T06:10:00.0000000Z",
    "name": "2021 Apple MacBook Pro 16-inch M1 Pro 16GB 512GB Space Gray - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/116065934544",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4727573960476552&mkt=en-US&setlang=en-US&w=e-RpUX4uNhhl2jc4XZ0m2nPj_ZnK2OnB",
    "dateLastCrawled": "2024-02-11T19:42:00.0000000Z",
    "name": "Apple MacBook Pro M1 2021 16 Inch 16GB Ram 512GB SSD Silver - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/285667002938",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4772134247750876&mkt=en-US&setlang=en-US&w=Hi3pWifhMRF6HeTsioUMEPIiZDiW68md",
    "dateLastCrawled": "2024-01-23T19:49:00.0000000Z",
    "name": "Apple MacBook Pro 16in (512 SSD, Apple M1 Pro, 32GB RAM) Laptop - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/305232162417",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4607259043386945&mkt=en-US&setlang=en-US&w=iPhoj4G62eMvI8OfLB4Tg-Kpth-Dz1Kd",
    "dateLastCrawled": "2023-10-31T01:32:00.0000000Z",
    "name": "Apple MacBook Pro 2021 16in M1 Pro 10 CPU 16 GPU 16GB RAM 1TB SSD ..."
  },
  {
    "url": "https://www.ebay.com/itm/204288924496",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4582541500486721&mkt=en-US&setlang=en-US&w=tt6fDqB045Qj5g3tpcG8gpv34bwWugug",
    "dateLastCrawled": "2023-11-03T20:09:00.0000000Z",
    "name": "Apple MacBook Pro w/ M1 Pro chip (16 inch,16GB RAM,1TB SSD,Late 2021 ..."
  },
  {
    "url": "https://www.ebay.com/itm/355275602163",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4902254567361176&mkt=en-US&setlang=en-US&w=DUgviep1-Wy1SYYY6P6SfaLSSbhtwppE",
    "dateLastCrawled": "2023-12-16T20:29:00.0000000Z",
    "name": "MacBook Pro M1, 16\", 16GB RAM, 512GB SSD, MK183LL/A | eBay"
  },
  {
    "url": "https://www.ebay.com/itm/225618543549",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4658068496125316&mkt=en-US&setlang=en-US&w=0NQOZldVUIlGPpYbr41eolFER5eFUQvO",
    "dateLastCrawled": "2023-10-15T15:31:00.0000000Z",
    "name": "Apple MacBook M1 Pro 16\" 2021 10-core CPU/16 GPU 1TB SSD Space ... - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/315100246045",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4511945120423147&mkt=en-US&setlang=en-US&w=-w5N2G4mQxwDy4e_XmZ8jABCJVvj1aNT",
    "dateLastCrawled": "2024-01-17T16:37:00.0000000Z",
    "name": "Apple MacBook Pro M1 Max 2021 16in Apple M1 Max 3.20Ghz 32GB 1TB Mac OS ..."
  },
  {
    "url": "https://www.ebay.com/itm/225868883217",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4996911357039803&mkt=en-US&setlang=en-US&w=rtVn-FMBO2HgVRyojQU9QIrBNgugkRq6",
    "dateLastCrawled": "2023-12-19T01:07:00.0000000Z",
    "name": "Apple MacBook Pro M1 Max 16\" 2021 10-Core CPU 32-Core GPU 1TB ... - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/225770367069",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=5004680947715520&mkt=en-US&setlang=en-US&w=fzgivCt4s7Pj3dAneViQJ7y61hYpra1L",
    "dateLastCrawled": "2023-10-07T22:57:00.0000000Z",
    "name": "Apple MacBook M1 Pro 16\" 2021 10-core CPU/ 16-core GPU 512GB SSD Gray ..."
  },
  {
    "url": "https://www.ebay.com/itm/285732877471",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4513031752389479&mkt=en-US&setlang=en-US&w=K4kWJ2url6EESiUduzdUli03_FjAfxGy",
    "dateLastCrawled": "2024-03-06T17:02:00.0000000Z",
    "name": "MacBook Pro 16\" 16in 2021 - M1 Pro 10-Core/16-Core GPU - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/145541472877",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4859996388463191&mkt=en-US&setlang=en-US&w=grdQPM20vfyiEn0Il7TE9XE6r00oFoQD",
    "dateLastCrawled": "2024-01-08T05:07:00.0000000Z",
    "name": "Apple MacBook Pro 14\" | M1 Pro 16-Core | 1TB | 16GB RAM - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/266590097398",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4865781715258121&mkt=en-US&setlang=en-US&w=ZySlGN-LKAiks-HlUr0n3KvKRE59e1BC",
    "dateLastCrawled": "2023-12-29T19:41:00.0000000Z",
    "name": "Apple MacBook Pro 16-inch 16\" i9 - M1 2021 - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/326004423951",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4800227621168366&mkt=en-US&setlang=en-US&w=RXHpgq4dDl-G5DakrWjF0xYkj2XzdJnd",
    "dateLastCrawled": "2024-02-11T08:18:00.0000000Z",
    "name": "Apple MacBook Pro M1 16 inch | eBay"
  },
  {
    "url": "https://www.ebay.com/itm/296174810307",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4908056728764630&mkt=en-US&setlang=en-US&w=0IcYiRI1gA637S_8H8x0IAMMfawJH3Vj",
    "dateLastCrawled": "2024-01-20T05:21:00.0000000Z",
    "name": "Apple Macbook Pro (16-Inch, 2021) M1 Pro 10-Core 1TB SSD 16GB Silver - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/256280716341",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4952166391765118&mkt=en-US&setlang=en-US&w=yt6yDfkQ1A3L_GWk7NYCeKx8yzNSv6Rr",
    "dateLastCrawled": "2024-03-12T01:01:00.0000000Z",
    "name": "2019 - 2021 Apple MacBook Pro 16-inch Up to M1 Max 3.2GHz Up to 64GB ..."
  },
  {
    "url": "https://www.ebay.com/itm/225770366951",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4558347944147433&mkt=en-US&setlang=en-US&w=wzXrZH5vJZkY5bM-KCUpYur6nDL4pruE",
    "dateLastCrawled": "2023-09-13T21:27:00.0000000Z",
    "name": "Apple MacBook Pro M1 Pro 14\" 2021 3.2 Ghz 1TB SSD 16GB RAM Gray ... - eBay"
  },
  {
    "url": "https://www.ebay.com/itm/166494008981",
    "cachedPageUrl": "http://cc.bingj.com/cache.aspx?q=site%3ahttps%3a%2f%2febay.com%2fitm+Mac+Book+Pro+M1+16in&d=4663115084738362&mkt=en-US&setlang=en-US&w=56McJ13jJA5IiihoQvG-umyEha1xTJxR",
    "dateLastCrawled": "2023-12-12T00:50:00.0000000Z",
    "name": "Apple MacBook Pro M1 Max 16\" 64GB RAM, 4TB SSD, 32-Core GPU ... - eBay"
  }
]

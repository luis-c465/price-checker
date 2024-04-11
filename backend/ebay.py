import logging
from asyncio import Condition
from typing import Optional

import lxml
from bs4 import BeautifulSoup

from _types import Condition, PossibleProduct
from util import make_product_dict


def scrape_w_soup(page: BeautifulSoup, url: str) -> PossibleProduct:
    """Takes in an already scraped and parsed page, and extracts the information

    Used separately for testing from already fetched pages
    """
    product_info = make_product_dict()

    if name := _name(page, url):
        product_info["name"] = name

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
        return int(float(rating_part) / 20)
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

def _name(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one(".x-item-title__mainTitle")

    if elm == None:
        logging.warning("@{url} description not found")
        return None

    txt = elm.text
    return txt.strip()

import logging
from asyncio import Condition
from pprint import pprint
from typing import Optional

import lxml
import requests
from bs4 import BeautifulSoup

from _types import Condition, PossibleProduct
from util import get_first_int, make_product_dict


def scrape(url: str) -> PossibleProduct:
    req = requests.get(url)
    if 400 <= req.status_code < 600:
        return None
    html = req.text
    page = BeautifulSoup(html, "lxml")
    return scrape_w_soup(page, url)


def scrape_w_soup(page: BeautifulSoup, url: str) -> PossibleProduct:
    """Takes in an already scraped and parsed page, and extracts the information

    Used separately for testing from already fetched pages
    """
    product_info = make_product_dict()

    if name := _name(page, url):
        product_info["name"] = name

    if price := _price(page, url):
        product_info["price"] = price

    product_info["condition"] = Condition.NEW

    if (shipping := _shipping(page, url)) != None:
        product_info["shipping"] = shipping

    if photos := _photos(page, url):
        product_info["photos"] = photos

    if num_ratings := _num_ratings(page, url):
        product_info["num_ratings"] = num_ratings

    if avg_rating := _avg_ratings(page, url):
        product_info["avg_rating"] = avg_rating

    if quantity := _quantity(page, url):
        product_info["quantity"] = quantity

    if description := _description(page, url):
        product_info["description"] = description

    return product_info


def _price(page: BeautifulSoup, url: str) -> Optional[float]:
    apex = page.select_one("#apex_desktop")
    if apex == None:
        print("mogus")
        return

    price_elm = apex.select_one(".a-price")
    if price_elm == None:
        print(apex)
        # logging.warning(f"@{url} price element not found")
        return None

    price_txt = price_elm.text
    if len(price_txt) == 0:
        logging.warning(f"@{url} price text is empty")
        return None

    # Split the text string by the dolor sign
    splices = price_txt.strip().split("$")
    if len(splices) == 1:
        logging.warning(
            f"@{url} price text '{price_txt}' does not have a '$', or formatted badly"
        )
        return None

    try:
        return float(splices[1].replace(",", ""))
    except ValueError:
        logging.warning(
            f"@{url} price '{splices[1]}' is not a float or formatted badly"
        )
        return None


def _subscription_price(page: BeautifulSoup, url: str) -> Optional[float]:
    """Handles that alternate case where the page is a subscription page containing different classnames & id's"""

    subscription_elm = page.select_one(
        "#buyBoxAccordion > #newAccordionRow_0 #apex_offerDisplay_desktop .a-size-base > .a-offscreen"
    )

    if subscription_elm == None:
        logging.warning(f"@{url} price element not found")
        return None

    price_txt = subscription_elm.text
    if len(price_txt) == 0:
        logging.warning(f"@{url} price text is empty")
        return None

    # Split the text string by the dolor sign
    splices = price_txt.strip().split("$", 1)
    if len(splices) != 2:
        logging.warning(
            f"@{url} price text '{price_txt}' does not have a '$', or formatted badly"
        )
        return None

    try:
        return float(splices[1].replace(",", ""))
    except ValueError:
        logging.warning(
            f"@{url} price '{splices[1]}' is not a float or formatted badly"
        )
        return None


def _shipping(page: BeautifulSoup, url: str) -> Optional[float]:
    elm = page.select_one("span[data-csa-c-delivery-price]")
    if elm == None:
        logging.warning(f"@{url} shipping element not found")
        return None

    price: str = elm.get("data-csa-c-delivery-price")
    if len(price) == 0:
        logging.warning(f"@{url}: shipping price is empty")
        return None

    if "free" in price.lower():
        return 0

    # Split the text string by the dolor sign
    splices = price.split("$", 1)
    if len(splices) != 2:
        logging.warning(
            f"@{url} shipping price text '{price}' does not have a '$', or formatted badly"
        )
        return None

    try:
        return float(splices[1])
    except ValueError:
        logging.warning(
            f"@{url} shipping price splice '{splices[1]}' is not a float or formatted badly"
        )
        return None


def _photos(page: BeautifulSoup, url: str) -> Optional[list[str]]:
    elm = page.select_one("#imageBlock #imgTagWrapperId > img")
    if elm == None:
        logging.warning(f"@{url} images not found")
        return None

    return [elm.get("src")]


def _num_ratings(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one("#acrCustomerReviewLink > #acrCustomerReviewText")
    if elm == None:
        logging.warning(f"@{url} number of ratings not found")
        return None

    txt = elm.text.strip().replace(",","")
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} number of ratings text invalid")
        return None

    try:
        return int(txt)
    except ValueError:
        logging.warning(f"@{url} number of ratings '{txt}' is not an int")
        return None


def _avg_ratings(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one("#averageCustomerReviews .a-icon-star")
    if elm == None:
        logging.warning(f"@{url} avg seller rating not found")
        return None

    rating = elm.text.strip()
    if not rating or len(rating) == 0:
        logging.warning(f"@{url} number of seller ratings text invalid")
        return None

    splits = rating.split(" ")
    if len(splits) == 0:
        logging.warning(f"@{url} avg rating splits invalid!")

    int_part = splits[0].replace(",", "")

    try:
        return int(float(int_part))
    except ValueError:
        logging.warning(f"@{url} avg rating '{rating}' is not an float")
        return None


def _quantity(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one("#availability")

    # If the availability element does not exist, then it is assumed there is only
    # one for sale
    if elm == None:
        return 1

    txt = elm.text.strip().lower()
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} availability is empty")
        return None

    if txt == "in stock":
        # Means unlimited availability!
        return -2

    # TODO: Fix me & use a regex searching for nay number in the string and return that!
    maybe_quantity = get_first_int(txt)
    if not maybe_quantity:
        logging.warning(f"@{url} there is no integer in the quantity!")
        return None

    return maybe_quantity


def _description(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one("#feature-bullets > ul > li")

    if elm == None:
        logging.warning(f"@{url} description not found")
        return None

    txt = elm.text.strip()
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} description is empty")
        return None

    return txt


def _name(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one("#title > #productTitle")

    if elm == None:
        logging.warning(f"@{url} product name not found")
        return None

    txt = elm.text.strip()
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} product name is empty")
        return None

    return txt


if __name__ == "__main__":
    URLS = [
        "https://cc.bingj.com/cache.aspx?q=site%3awww.amazon.com+MacBook+M1+Used&d=4507967990595787&mkt=en-US&setlang=en-US&w=8xLDlGrJ0oYB_Ivb-SUNxRdd0FmoLDuC",
        "https://cc.bingj.com/cache.aspx?q=site%3awww.amazon.com+Apple+Macbook+pro&d=4682962140674402&mkt=en-US&setlang=en-US&w=fMSFdVWUR_9RkMNNqB4GnJjiP5zsbbKN",
        "https://cc.bingj.com/cache.aspx?q=site%3awww.amazon.com+Apple+MacBook+Pro&d=4507967992561958&mkt=en-US&setlang=en-US&w=AK9BAVDSsCIB_Ivb-SUNxRdd0FmoLDuC",
        "http://cc.bingj.com/cache.aspx?q=site%3awww.amazon.com+Apple+MacBook+Pro&d=4682962140674402&mkt=en-US&setlang=en-US&w=fMSFdVWUR_9RkMNNqB4GnJjiP5zsbbKN",
        "http://cc.bingj.com/cache.aspx?q=site%3awww.amazon.com+Apple+MacBook+Pro&d=4670820266283787&mkt=en-US&setlang=en-US&w=lvS1PIo0LsRMCxuRWxeyiG-A-wwEHi89",
        "http://cc.bingj.com/cache.aspx?q=site%3awww.amazon.com+Apple+MacBook+Pro&d=4682962140674402&mkt=en-US&setlang=en-US&w=fMSFdVWUR_9RkMNNqB4GnJjiP5zsbbKN"
    ]
    for url in URLS:
        pprint(scrape(url))

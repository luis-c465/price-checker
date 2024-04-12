import json
import logging
from asyncio import Condition
from pprint import pprint
from typing import Optional

import requests
from bs4 import BeautifulSoup

from _types import Condition, PossibleProduct
from util import make_product_dict, serialize_product


def scrape(url: str) -> PossibleProduct:
    req = requests.get(url)
    if 400 <= req.status_code < 600:
        # The request it not ok
        return None

    html = req.text
    page = BeautifulSoup(html, "html.parser")
    return scrape_w_soup(page, url)


def scrape_w_soup(page: BeautifulSoup, url: str) -> PossibleProduct:

    product_info = make_product_dict()

    if product_name := _product_name(page, url):
        product_info["name"] = product_name

    if price := _price(page, url):
        product_info["price"] = price

    if condition := _condition(page, url):
        product_info["condition"] = condition

    if (shipping := _shipping(page, url)) != None:
        product_info["shipping"] = shipping

    if photos := _photos(page, url):
        product_info["photos"] = photos

    if seller_num_ratings := _seller_num_ratings(page, url):
        product_info["num_ratings"] = seller_num_ratings

    if seller_avg_ratings := _seller_avg_ratings(page, url):
        product_info["avg_rating"] = seller_avg_ratings

    if quantity := _quantity(page, url):
        product_info["quantity"] = quantity

    if description := _description(page, url):
        product_info["description"] = description

    return product_info



def _product_name(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one(".product-details__badge-title--wrapper")
    if elm == None:
        logging.warning(f"@{url} name not found")
        return None

    return elm.get_text(strip=True)

def _price(page: BeautifulSoup, url: str) -> Optional[float]:
    price_elm = page.select_one(".price")
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


def _condition(page: BeautifulSoup, url: str) -> Optional[str]:
    return Condition.NEW


def _seller_num_ratings(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one(".sui-font-regular.sui-text-xs.sui-leading-tight.sui-tracking-normal.sui-normal-case.sui-line-clamp-unset.sui-text-primary")
    #".sticky-nav__ratings-reviews
    if elm == None:
        logging.warning(f"@{url} number of seller ratings not found")
        return None

    txt = elm.text
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} number of seller ratings text invalid")
        return None

    int_part = txt[1 : len(txt) - 1]
    try:
        return int(int_part)
    except ValueError:
        logging.warning(f"@{url} number of seller ratings '{int_part}' is not an int")
        return None


def _seller_avg_ratings(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one(".sui-mr-1")
    if elm == None:
        logging.warning(f"@{url} avg seller rating not found")
        return None

    txt = elm.text.strip()
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} number of seller ratings text invalid")
        return None

    splits = txt.split(".", maxsplit=1)
    if len(splits) != 2:
        logging.warning(f"@{url} the number of splits in '{txt} is not 2'")
        return None

    rating_part = splits[0]
    try:
        #return round(float(rating_part), ndigits=None)
        return int(rating_part)
    except ValueError:
        logging.warning(f"@{url} avg seller ratings '{rating_part}' is not an int")
        return None


def _shipping(page: BeautifulSoup, url: str) -> Optional[float]:
    elm = page.select_one(".card-messaging-bottom.u__bold")
    if elm == None:
        logging.warning(f"@{url} shipping element not found")
        return None

    txt = elm.text
    if len(txt) == 0:
        logging.warning(f"@{url}: price is empty")
        return None

    if "free" in txt.lower():
        return 0

    splices = txt.split("$", 1)
    if len(splices) != 2:
        logging.warning(
            f"@{url} shipping price text '{txt}' does not have a '$', or formatted badly"
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
    elms = page.select(".mediagallery__mainimage--clickable img")
    if elms == None or len(elms) == 0:
        logging.warning(f"@{url} images not found")
        return None

    return [img for elm in elms if (img := elm.get("src", default=None))]


def _quantity(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one(".fulfillment-qty-row .u__text--success")

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
    elm = page.select_one(".sui-text-base.sui-list-disc.list.list--type-square")

    if elm == None:
        logging.warning(f"@{url} description not found")
        return None

    ##txt = elm.get("content", None)
    txt = elm.get_text(strip=True)
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} description is empty")
        return None

    return txt


if __name__ == "__main__":
    urls = [
        "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=5005733221502780&mkt=en-US&setlang=en-US&w=2A5omBdRC2HkWA_VtzKFQ_qw2JnacdZ-",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4781862347747130&mkt=en-US&setlang=en-US&w=G2FA3i7VXbt-ikALhDgdoEl4Myf7wFe8",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4807520484735958&mkt=en-US&setlang=en-US&w=6XSEf6gGZQOKNVHxaZdRQ4wh1i9UFegz",
        #"http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4532337629743198&mkt=en-US&setlang=en-US&w=8eHN8sZbMycNEb0Bd_H2lLdrlr2m5N-x",
        #"http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4521368286142879&mkt=en-US&setlang=en-US&w=sQYoatQAIbQIFPBWigGHerUhlwBFaqQY",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4910874574659251&mkt=en-US&setlang=en-US&w=tVg3vPZK6lW5NVHrUDQVJAiGAmh5kEuK",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4724700627083582&mkt=en-US&setlang=en-US&w=Ld4u2Xcuy-xki_tMMM9c5G3XnDA64dDD",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4860047931539940&mkt=en-US&setlang=en-US&w=VicDTqEThdOiGBs1Qp_L2R9bynK-G_uq",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4680166103280022&mkt=en-US&setlang=en-US&w=6euubdUxzGNQSzdEgoqrORy75HTkKJIR",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4873473999896656&mkt=en-US&setlang=en-US&w=Y1kpptoKY9WoMwLkefcuAavV2u7H0_iJ",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4728523149411374&mkt=en-US&setlang=en-US&w=aQ6lxQGBaA5mSOqV0-2BrnsfqNaWyLZF",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4793583308993581&mkt=en-US&setlang=en-US&w=0ZzZ9-ZX-uCD3vlkS-6j9_29zjs4UgPQ",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4577649539162092&mkt=en-US&setlang=en-US&w=LILNIkGMrz0hrK7dgg71HZvZfBwvZSKH",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4980856766875284&mkt=en-US&setlang=en-US&w=og3x4O8VkbLZCEmGcftwL5o5WL3RJkGG",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4588008998730166&mkt=en-US&setlang=en-US&w=fr877y8TpoUmYvGJaSk0cxeL3c1Uw305",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4960696194986292&mkt=en-US&setlang=en-US&w=v_m54xuA4VzP3VUvUvsE_P2DFx-MB7CL",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4521698991819493&mkt=en-US&setlang=en-US&w=2Ve55JKb3C0IO063l4wAwnRhgk4XfNPt",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4790636959578329&mkt=en-US&setlang=en-US&w=2dpyaPg7stWCh8HWaowTybk2NiAoovi7",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4778211626393012&mkt=en-US&setlang=en-US&w=j2VpbZCgPLl84RaH1Oj7mdRsmOrRS7nd",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4606876792618000&mkt=en-US&setlang=en-US&w=iSoB2m6VNvgu93wQIu7FR-sLxiESqH3t",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4834097737564507&mkt=en-US&setlang=en-US&w=fExmUi1Jl5CWSxUyIWz15r-Ed0pBA_9g",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4519873629727062&mkt=en-US&setlang=en-US&w=6GZRk_0jEk4HZvPjT9YI56Ov1ttpuBE8",
        # "http://cc.bingj.com/cache.aspx?q=site%3awww.homedepot.com%2fp+tap+and+die+set&d=4755525268013057&mkt=en-US&setlang=en-US&w=iR8HUEoKfsdykADoHweI-Lh_LCpJnyDO",
    ]

    for data in urls:
        output = scrape(data)
        with open("scrape.json", "w") as f:
            f.write(json.dumps(serialize_product(output)))
        pprint(output)

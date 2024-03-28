import logging
from typing import Optional
import requests
from bs4 import BeautifulSoup
from _types import Condition, PossibleProduct
from util import make_product_dict


def scrape(url: str) ->PossibleProduct:
    req = requests.get(url)
    if 400 <= req.status_code < 600:
        return None
    html = req.text
    page = BeautifulSoup(html, "html.parser")
    return (page)


def scrape_w_soup(page: BeautifulSoup, url: str) -> PossibleProduct:
    product_info = make_product_dict()


    if price := _price(page, url):
        product_info["price"] = price

    if condition := _condition(page, url):
        product_info["condition"] = condition

    if photos := _photos(page, url):
        product_info["photos"] = photos

    if seller_num_ratings := _seller_num_ratings(page, url):
        product_info["seller_num_ratings"] = seller_num_ratings
    
    if description := _description(page, url):
        product_info["description"] = description

    return product_info




def _price(page: BeautifulSoup, url: str) -> Optional[float] :
    price_elm = page.select_one(".MuiTypography-root.MuiTypography-h3.MuiTypography-colorTextPrimary.MuiTypography-displayInline")
    if price_elm == None:
        logging.warning(f"@{url} price element not found")
        return None
    
    price_txt = price_elm.text
    if len(price_txt) == 0:
        logging.warning(f"@{url} price text is empty")
        return None
    
    splice = price_txt.split("$", 1)
    if len(splice) != 2:
        logging.warning(f"@{url} price text '{price_txt}' does not have a '$', or formatted badly")
        return None
    try:
        return float(splice[1].replace(",", ""))
    except ValueError:
        logging.warning(f"@{url} price '{splice[1]}' is not a float or formatted badly")
        return None
    


def _condition(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one(".MuiTypography-root.jss1988.MuiTypography-body1.MuiTypography-colorTextPrimary")
    if elm == None:
        logging.warning(f"@{url} condition element not found")
        return None

    condition_txt = elm.text
    if len(condition_txt) == 0:
        logging.warning(f"@{url}: condition is empty")

        return None

    return condition_txt

def _shipping(page: BeautifulSoup, url: str) -> Optional[float]:
    return None


def _photos(page: BeautifulSoup, url: str) -> Optional[list[str]]:
    elms = page.select("", limit=0)


def _seller_num_ratings(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one("")


def _seller_avg_ratings(page: BeautifulSoup, url:str) -> Optional[int]:
    return None

def _quantity(page: BeautifulSoup, url: str) -> Optional[int]:
    return None

def _description(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one("")
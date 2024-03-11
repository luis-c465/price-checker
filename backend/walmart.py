from typing import TypedDict

import requests
from bs4 import BeautifulSoup

class WalmartInfo(TypedDict):
    price: int
    shipping: int
    photos: list[str]


def scrape(url: str) -> WalmartInfo:
    info: WalmartInfo = {}

    html = requests.get(url).text
    page = BeautifulSoup(html, "html.parser")

    price_txt = page.find("span", attrs={"itemprop": "price"}).text.strip()

    price = page.find("div", attrs={"class": "x-price-primary"}).text
    quality = page.select_one(".x-item-condition-text .ux-textspans").text
    print(title, price, quality)

    return info

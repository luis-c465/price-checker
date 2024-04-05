import logging
from asyncio import Condition
from typing import Optional
from pprint import pprint

import requests
from bs4 import BeautifulSoup

from _types import Condition, PossibleProduct
from util import make_product_dict


def scrape(url: str) -> PossibleProduct:
    req = requests.get(url)
    if 400 <= req.status_code < 600:
        
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
    elm = page.select_one(".lh-copy.dark-gray.mv1.f3.mh0-l.mh3.b")
    if elm == None:
        logging.warning(f"@{url} name not found")
        return None
    
    return elm.get_text(strip=True) 


def _price(page: BeautifulSoup, url: str) -> Optional[float]:
    price_elm = page.select_one(".b.lh-copy.dark-gray.f1.mr2")
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
    elm = page.select_one(".ml1.f7.dark-gray.underline")
    if elm == None:
        logging.warning(f"@{url} number of seller ratings not found")
        return None

    txt = elm.text.strip()
    if not txt or len(txt) == 0:
        logging.warning(f"@{url} number of seller ratings text invalid")
        return None

    #int_part = txt[1 : len(txt) - 1]
    sum = txt.split("(")[1].split(" ")[0]
    try:
        return int(sum)

       # rating_txt, _ = txt.split("(" " reviews)", 1)
       # reviews = int(rating_txt)
       # return reviews


    except ValueError:
        logging.warning(f"@{url} number of seller ratings '{sum}' is not an int")
        return None


    

def _seller_avg_ratings(page: BeautifulSoup, url: str) -> Optional[int]:
    elm = page.select_one(".f-headline.b")
    #.f-headline.b
    #f7.rating-number
    if elm is None:
        logging.warning(f"@{url} avg seller rating not found")
        return None

    txt = elm.text.strip()
    if not txt:
        logging.warning(f"@{url} seller ratings text is empty")
        return None

    try:

        rating_txt, _ = txt.split(" out of ", 1)
        rating = float(rating_txt)
        rounded_rating = int(rating)
        return rounded_rating
    except ValueError:
        logging.warning(f"@{url} avg seller ratings '{txt}' is not a valid float")
        return None




def _shipping(page: BeautifulSoup, url: str) -> Optional[float]:
    elm = page.select_one(".mt1.h1 .f7")
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
    elms = page.select(".mr3.ml7.self-center.relative img")
    if elms == None or len(elms) == 0:
        logging.warning(f"@{url} images not found")
        return None

    return [img for elm in elms if (img := elm.get("src", default=None))]



def _quantity(page: BeautifulSoup, url: str) -> Optional[int]:
   return 1


def _description(page: BeautifulSoup, url: str) -> Optional[str]:
    elm = page.select_one(".dangerous-html.mb3")

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
    urls =[
        #    "https://cc.bingj.com/cache.aspx?q=https%3a%2f%2fwww.walmart.com%2fip%2fApple-MacBook-Air-13-3-inch-Laptop-Space-Gray-M1-Chip-8GB-RAM-256GB-storage%2f609040889%3fathbdg%3dL1102&d=4822488442150829&mkt=en-US&setlang=en-US&w=SWtTZxloZCCRA_u54SZ0N0ePg7v59XTT",
        #    "https://cc.bingj.com/cache.aspx?q=https%3a%2f%2fwww.walmart.com%2fip%2fPhilips-75-Class-4K-Ultra-HD-2160p-Google-Smart-LED-TV-75PUL7552-F7-New%2f873651804%3fadsRedirect%3dtrue&d=4926916282434192&mkt=en-US&setlang=en-US&w=v589VEUmk93AgKPpT5IccBpSFtLSvmgp",
        #    "https://cc.bingj.com/cache.aspx?q=https%3a%2f%2fwww.walmart.com%2fip%2fTwin-Size-Organic-Mattress-Nisien-10-Inch-Gel-Memory-Foam-Hybrid-Mattress-Box-Fiberglass-Free-Medium-Firm-Euro-Top-Bed-Cooler-Sleep-100-Night-Free-Tr%2f1824834651%3fathAsset%3deyJhdGhjcGlkIjoiMTgyNDgzNDY1MSIsImF0aHN0aWQiOiJDUzAyMCJ9%26athena%3dtrue&d=4805918459639246&mkt=en-US&setlang=en-US&w=1sUIzVa2XXuJeqyWcJiZ5MsigIKE612u",
        #    "https://cc.bingj.com/cache.aspx?q=https%3a%2f%2fwww.walmart.com%2fip%2fIntex-Sierra-K2-Inflatable-Kayak-with-Oars-and-Hand-Pump%2f702368949%3fathAsset%3deyJhdGhjcGlkIjoiNzAyMzY4OTQ5IiwiYXRoc3RpZCI6IkNTMDIwIn0%3d%26athena%3dtrue&d=4943576466937893&mkt=en-US&setlang=en-US&w=D8GBef3Q5rrIFF7cMydN8ZcK5vif-2mg",
             "https://cc.bingj.com/cache.aspx?q=https%3a%2f%2fwww.walmart.com%2fip%2fKenmore-02620362-Top-Load-Washer-with-Triple-Action-Agitator-3-8-Cu-ft-Capacity%2f2503500596%3fadsRedirect%3dtrue&d=4688683035198510&mkt=en-US&setlang=en-US&w=D58GpSVotmJUKoeG_vFG1GzIxcu8dD7D"
          ]

    for data in urls:
            output = scrape(data)
            pprint(output)
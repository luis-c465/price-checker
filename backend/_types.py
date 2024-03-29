import datetime
import enum
from typing import Optional, TypedDict


class Condition(enum.Enum):
    NEW = 0
    USED = 1
    UNSET = -1

class Product(TypedDict):
    price: float
    "Price of the item in USD"

    shipping: float
    "Cost of shipping the item, of not found, -1, can be 0"

    condition: Condition
    "The condition of the item"

    photos: list[str]
    "A list of urls for the photos of the product"

    num_ratings: int
    "Number of ratings the product has received"

    avg_rating: int
    "The average rating of the product from 0-100"

    seller_num_ratings: int
    "Number of ratings the seller has received"

    seller_avg_ratings: int
    "Average rating of the seller from 0-100"

    measurements: str
    "The measurements of the product, if not found or N/A is empty"

    quantity: int
    "The number of items left in stock, in sites like ebay will usually be 1"

    description: str
    "The description of the item, either from the seller or the product page"

    lastUpdatedAt: datetime.datetime
    "The date time which the product information was last updated at"

    url: str
    "The full url that the item was found on"

    name: str
    "The name of the product listing"


PossibleProduct = Optional[Product]

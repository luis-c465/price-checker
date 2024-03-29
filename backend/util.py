import re
import typing
from datetime import datetime

from _types import Condition, Product

_EPOCH = datetime(1970, 1, 1)
def make_product_dict() -> Product:
    return {
        "price": -1,
        "shipping": -1,
        "condition": Condition.UNSET,
        "photos": [],
        "num_ratings": -1,
        "avg_rating": -1,
        "seller_avg_ratings": -1,
        "seller_num_ratings": -1,
        "measurements": "",
        "quantity": -1,
        "description": "",
        "lastUpdatedAt": _EPOCH,
        "url": None,
        "name": None
    }


def serialize_product(p: Product) -> dict:
    d = {}
    d.update(p)

    d["condition"] = p["condition"].name
    d["lastUpdatedAt"] = p["lastUpdatedAt"].isoformat()

    return d

def get_first_int(s: str) -> typing.Optional[int]:
    """Gets the first int in a given string
    If an integer does not exist in the input string returns None

    Uses regex to accomplish this task
    """

    match  = re.search("[0-9]+", s)
    if not match:
        return None

    data = match.group()
    try:
        return int(data)
    except Exception:
        return None

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
        "url": None
    }


def serialize_product(p: Product) -> dict:
    d = {}
    d.update(p)

    d["condition"] = p["condition"].name
    d["lastUpdatedAt"] = p["lastUpdatedAt"].isoformat()

    return d

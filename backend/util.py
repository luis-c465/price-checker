from _types import Condition, Product


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
        "description": ""
    }

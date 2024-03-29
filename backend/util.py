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

def longest_common_substring(strings: list[str], threshold: int = 100):
    """Finds the longest common substring in a list of strings

    The threshold is a number ranging from 0 to 100 inclusive
    which determines the percentage of strings that should contain the longest common substring

    In general decreasing the threshold increases the length of the longest common string
    """

    if not strings:
        return ""

    # Find the shortest string in the list
    shortest_str = min(strings, key=len)

    # Initialize the longest common substring
    longest_substring = ""

    # Iterate through all possible substrings of the shortest string
    for i in range(len(shortest_str)):
        for j in range(i + 1, len(shortest_str) + 1):
            substring = shortest_str[i:j]

            # Count how many strings contain the current substring
            count = sum(substring in s for s in strings)

            # Calculate the percentage of strings containing the substring
            percentage = (count / len(strings)) * 100

            # Check if the substring is present in at least 'threshold' percentage of strings
            if percentage >= threshold:
                if len(substring) > len(longest_substring):
                    longest_substring = substring

    return longest_substring

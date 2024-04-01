import unittest

from _types import Condition, Product
from offerup import scrape_w_soup

from .util import Test


class TestOfferUp(Test):
    def test_xpensiveChair(self):
        url = "https://offerup.com/item/detail/57c20057-7a52-3ed4-a0cb-0d59ca7fb34e"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "price": 100,
            "shipping": -1,
            "condition": Condition.NEW,
            "photos": [
                "https://i.ebayimg.com/images/g/dHAAAOSwqoxjVz8~/s-l1600.jpg",
                "https://i.ebayimg.com/images/g/3sUAAOSwePFjVz9D/s-l1600.jpg",
                "https://i.ebayimg.com/images/g/PH4AAOSwsi5jVz9H/s-l1600.jpg"
                       ],
            "num_ratings": -1,
            "avg_rating": -1,
            "seller_num_ratings": 7,
            "seller_avg_ratings": 100,
            "measurements": "",
            "quantity": -1,
            "description": " "
        }
        self.assertDictEqual(output, should)


if __name__ == "__main__":
    unittest.main()

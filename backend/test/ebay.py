import unittest
from unittest import TestCase

from _types import Condition, Product

from ..ebay import scrape


class TestEbay(TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.maxDiff = None

    def test_amogus(self):
        output = scrape("https://www.ebay.com/itm/314202479340")
        should: Product = {
            "price": 55.00,
            "shipping": 8.60,
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
            "quantity": 1,
        }
        self.assertDictEqual(output, should)

    def test_fuse(self):
        output = scrape("https://www.ebay.com/itm/166500278950")
        should: Product = {
            "price": 8.99,
            "shipping": 0,
            "condition": Condition.NEW,
            "photos": [
                "https://i.ebayimg.com/images/g/vVoAAOSwn0Ble3nT/s-l1600.jpg",
                       ],
            "num_ratings": -1,
            "avg_rating": -1,
            "seller_num_ratings": 45701,
            "seller_avg_ratings": 100,
            "measurements": "",
            "quantity": 1,
        }
        self.assertDictEqual(output, should)

if __name__ == "__main__":
    unittest.main()

import unittest

from _types import Condition, Product
from ebay import scrape_w_soup

from .util import Test


class TestEbay(Test):
    def test_amogus(self):
        url = "https://www.ebay.com/itm/314202479340"
        output = scrape_w_soup(self.get_page(url), url)
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
            "description": "Amogus statue-great gift, desk ornament, joke  large and red. ",
        }
        self.assertProductsEqual(output, should)

    def test_fuse(self):
        url = "https://www.ebay.com/itm/166500278950"
        output = scrape_w_soup(self.get_page(url), url)
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
            "quantity": -1,
            "description": "Find many great new & used options and get the best deals for SIBA CERAMIC FUSE | 6.3X32MM | Time Delay | T200mA | 7006565.0.200 | 500V at the best online prices at eBay! Free shipping for many products!"
        }
        self.assertProductsEqual(output, should)

    def test_foundry(self):
        url = 'https://www.ebay.com/itm/322529066500'
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "price": 35.95,
            "shipping": 0,
            "condition": Condition.NEW,
            "photos": [
                "https://i.ebayimg.com/images/g/0xwAAOSwTjdfjD-1/s-l1600.jpg",
                "https://i.ebayimg.com/images/g/m5gAAOSwe3tfjD-y/s-l1600.jpg",
                "https://i.ebayimg.com/images/g/1V4AAOSwZn9fjD-y/s-l1600.jpg"
            ],
            "num_ratings": -1,
            "avg_rating": -1,
            "seller_num_ratings": 51157,
            "seller_avg_ratings": 99,
            "measurements": "",
            "quantity": -1,
            "description": """Ideal for use with our graphite foundry crucibles; up to a #3 - 4 Kg. Tongs will firmly grip onto the lip of the crucible. This kit includes a No. 3 - 4 Kg Clay Graphite Foundry Crucible and a pair of 19" Hinge Style Foundry Crucible Tongs."""
        }

        self.assertProductsEqual(output, should)

if __name__ == "__main__":
    unittest.main()

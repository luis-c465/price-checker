import unittest

from _types import Condition, Product
from amazon import scrape_w_soup
from util import _EPOCH

from .util import Test


class TestAmazon(Test):
    def test_tap(self):
        url = "https://www.amazon.com/uxcell-Titanium-Straight-Machine-Threading/dp/B0CH1DZPQH/"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "price": 20.29,
            "shipping": 0,
            "condition": Condition.NEW,
            "photos": [
                "https://m.media-amazon.com/images/I/51n1uFCflvL.__AC_SX300_SY300_QL70_ML2_.jpg",
                       ],
            "num_ratings": 1,
            "avg_rating": 100,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": 14,
            "description": 'Metric Thread Tap: Thread size: M20 x 2.5; accuracy: H2; square shank width: 11mm / 0.43"; thread length: 40mm / 1.57"; total length: 110mm / 4.33". Clear threads, right hand tapping direction. The screw Tap can make new threads or re-thread damaged or jammed threads.',
            "lastUpdatedAt": _EPOCH,
            "url": None
        }
        self.assertDictEqual(output, should)

    def test_beef_jerky(self):
        url = "https://www.amazon.com/Jack-Links-Snacks-Jerky-Teriyaki/dp/B00VB1Y3UA/"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "price": 9.58,
            "shipping": 0,
            "condition": Condition.NEW,
            "photos": [
                "https://m.media-amazon.com/images/I/51BbQ75RqHL._SX300_SY300_QL70_FMwebp_.jpg",
                       ],
            "num_ratings": 33388,
            "avg_rating": 92,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": -2,
            "description": "GOOD SOURCE OF PROTEIN: Protein is an essential part of your diet. With 11 grams of protein and 80 calories per serving, it's a must-have snack to help keep you satisfied and energized all day",
            "lastUpdatedAt": _EPOCH,
            "url": None
        }
        self.assertDictEqual(output, should)

    def test_samsung_monitor(self):
        url = "https://www.amazon.com/SAMSUNG-27-inch-Border-Less-FreeSync-LF27T350FHNXZA"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "price": 119.02,
            "shipping": 0,
            "condition": Condition.NEW,
            "photos": [
                "https://m.media-amazon.com/images/I/61B8Lq5NXmL.__AC_SX300_SY300_QL70_ML2_.jpg",
                       ],
            "num_ratings": 4459,
            "avg_rating": 90,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": -2,
            "description": "ALL-EXPANSIVE VIEW: The 3-sided borderless display brings a clean and modern aesthetic to any working environment. In a multi-monitor setup, the displays line up seamlessly for a virtually gapless view without distractions.Aspect ratio:16:9.Response time:5.0 milliseconds",
            "lastUpdatedAt": _EPOCH,
            "url": None
        }
        self.assertDictEqual(output, should)



if __name__ == "__main__":
    unittest.main()

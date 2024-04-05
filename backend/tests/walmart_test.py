import unittest

from _types import Condition, Product
from walmart import scrape_w_soup

from .util import Test


class TestWalmart(Test):
    def test_macbookair(self):
        url = "https://www.walmart.com/ip/Apple-MacBook-Air-13-3-inch-Laptop-Space-Gray-M1-Chip-8GB-RAM-256GB-storage/609040889"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "name": "Apple MacBook Air 13.3 inch Laptop - Space Gray, M1 Chip, 8GB RAM, 256GB storage",
            "price": 699.00,
            "shipping": 0,
            "condition": Condition.NEW,
            "photos": ["https://i5.walmartimages.com/seo/Apple-MacBook-Air-13-3-inch-Laptop-Space-Gray-M1-Chip-8GB-RAM-256GB-storage_af1d4133-6de9-4bdcb1c6-1ca8bd0af7a0.c0eb74c31b2cb05df4ed11124d0e255b.jpeg?odnHeight=640&amp;odnWidth=640&amp;odnBg=FFFFFF",
                       ],
            "num_ratings": 346,
            "avg_rating": 4,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": 1,
            "description": "The 13-inch MacBook Air with the Apple M1 chip is incredibly thin and light with a silent fanless design. It delivers remarkable performance and up to 18 hours of battery life. And it has a beautiful Retina display for super sharp text and vibrant colors. It’s an amazing laptop at an amazing price that Walmart customer's will love.",
        }
        self.assertProductsEqual(output, should)

if __name__ == "__main__":
    unittest.main()
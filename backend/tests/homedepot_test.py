import unittest

from _types import Condition, Product
from homedepot import scrape_w_soup

from .util import Test


class TestHomeDepot(Test):
    def test_ratcheting_tap(self):
        url = "https://www.homedepot.com/p/GEARWRENCH-SAE-Metric-Ratcheting-Tap-and-Die-Set-114-Piece-82812/204619484"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "price": 263.84,
            "shipping": -1,
            "condition": Condition.NEW,
            "photos": [
                "https://images.thdstatic.com/productImages/b8ccee75-9683-4355-aad7-251d27bcf53e/svn/gearwrench-taps-82812-64_600.jpg",
                       ],
            "num_ratings": 68,
            "avg_rating": 4,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": 1,
            "description": '''5 degree ratcheting arc with reversible leverPatented twist lock systemAuto-locking feature allows for safe removal of tap adapterView More Details''',
            "name": "SAE/Metric Ratcheting Tap and Die Set (114-Piece)"
        }
        self.assertProductsEqual(output, should)

    def test_tap_and_die_set(self):
        url = "https://www.homedepot.com/p/Milwaukee-SAE-Tap-and-Die-PACKOUT-Set-w-Hex-LOK-2-in-1-Handle-38-Piece-49-22-5604/325910108"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "price": 199.00,
            "shipping": -1,
            "condition": Condition.NEW,
            "photos": [
                "https://images.thdstatic.com/productImages/279fda32-dee3-4b10-b32b-873d09254ffe/svn/milwaukee-taps-49-22-5604-64_600.jpg",
                       ],
            "num_ratings": 6,
            "avg_rating": 4,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": 1,
            "description": "Hex-LOK™ 2-in-1 Handle is the most versatile threading solutionIncludes precision machined threading accessories for common usesHex-LOK™ 2-in-1 Handle is compatible w/ 1” hex dies & Tap ColletView More Details",
            "name": "SAE Tap and Die PACKOUT Set w/Hex-LOK 2-in-1 Handle (38-Piece)"
        }
        self.assertProductsEqual(output, should)

    def test_sae_metric(self):
        url = "https://www.homedepot.com/p/Husky-SAE-Metric-Ratcheting-Tap-and-Die-Set-77-Piece-HTAPDIE77PC/325057382"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "name": "SAE/Metric Ratcheting Tap and Die Set (77-Piece)",
            "price": 139.00,
            "shipping": -1,
            "condition": Condition.NEW,
            "photos": [
                "https://images.thdstatic.com/productImages/52820142-2a88-481f-91b6-15cf06883843/svn/husky-taps-htapdie77pc-64_600.jpg",
                       ],
            "num_ratings": 158,
            "avg_rating": 4,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": 1,
            "description": "Includes SAE and Metric Taps and DiesDie adapter works on hex shaped and round diesRatcheting T-handles only needs a 5° swing arcView More Details",
        }
        self.assertProductsEqual(output, should)

def test_stainless_fridge(self):
        url = "https://www.homedepot.com/p/Frigidaire-36-in-25-6-cu-ft-Side-by-Side-Refrigerator-in-Stainless-Steel-Standard-Depth-FRSS2623AS/320970662"
        output = scrape_w_soup(self.get_page(url), url)
        should: Product = {
            "name": "36 in. 25.6 cu. ft. Side by Side Refrigerator in Stainless Steel, Standard Depth",
            "price": 1048.00,
            "shipping": -1,
            "condition": Condition.NEW,
            "photos": [
                "https://images.thdstatic.com/productImages/0a4c11ea-df91-43c1-90b1-89b54770f933/svn/stainless-steel-frigidaire-side-by-side-refrigerators-frss2623as-64_1000.jpg",
                       ],
            "num_ratings": 8473,
            "avg_rating": 4,
            "seller_num_ratings": -1,
            "seller_avg_ratings": -1,
            "measurements": "",
            "quantity": 1,
            "description": "Three flexible shelves that are easily adjustable and removableEnjoy the largest ice bucket capacity at 11-lbBuilt in air filter that captures and keeps odors awayView More Details",
        }
        self.assertProductsEqual(output, should)
    


if __name__ == "__main__":
    unittest.main()

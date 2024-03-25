import typing
from unittest import TestCase
from urllib.parse import quote_plus

import lxml
from bs4 import BeautifulSoup

if typing.TYPE_CHECKING:
    from _types import Product


class Test(TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.maxDiff = None

    @staticmethod
    def get_page(url: str) -> BeautifulSoup:
        """Gets a cached version of the page if available

        Else makes a request to the page, caches it, then returns the page
        """
        path = f"tests/pages/{quote_plus(url)}.html"
        try:
            f = open(path, "r")
            txt = f.read()
            f.close()
            return BeautifulSoup(txt, "lxml")
        except FileNotFoundError as e:
            print(f"The file {path} was not found!")
            print(f"""Go to the page {url} on a browser with javascript disabled
                  and then save the page to the pages directory as:
                  \n{path}""")

            raise e

    def assertProductsEqual(self, a: "Product", b: "Product"):
        self.assertIsNotNone(a, "Product a is null!")
        self.assertIsNotNone(b, "Product b is null!")

        self.assertKeyEqual(a, b, "price", "The prices are not equal")
        self.assertKeyEqual(a, b, "shipping", "The shipping prices are not equal")
        self.assertKeyEqual(a, b, "condition", "The condition of the items are not equal")

        with self.subTest():
            self.assertListEqual(a["photos"], b["photos"], "The photos are not equal")

        self.assertKeyEqual(a, b, "num_ratings", "The number of ratings are not equal")
        self.assertKeyEqual(a, b, "avg_rating", "The avg rating of the products are not equal")
        self.assertKeyEqual(a, b, "seller_num_ratings", "The num of seller ratings are not equal")
        self.assertKeyEqual(a, b, "measurements", "The measurements of the proudcts are not equal")
        self.assertKeyEqual(a, b, "quantity", "The quantity available of the proudcts are not equal")

        with self.subTest():
            self.assertEqual(a["description"].strip(), b["description"].strip(),
                             "The description of the products are not equal")

    def assertKeyEqual(self, a: dict, b:dict, k: str, msg: str):
        with self.subTest():
            self.assertEqual(a[k], b[k], msg)

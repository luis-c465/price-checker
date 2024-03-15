from unittest import TestCase
from urllib.parse import quote_plus
from urllib.request import url2pathname

import requests
from bs4 import BeautifulSoup


class Test(TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.maxDiff = None

    @staticmethod
    def get_page(url: str) -> BeautifulSoup:
        """Gets a cached version of the page if available

        Else makes a request to the page, caches it, then returns the page
        """
        path = f"tests/tmp/{quote_plus(url)}.html"
        try:
            f = open(path, "r")
            txt = f.read()
            f.close()
            return BeautifulSoup(txt, "html.parser")
        except FileNotFoundError:
            # The file does not exist, so cache it!

            req = requests.get(url)
            req.raise_for_status()

            with open(path, "w+") as f:
                f.write(req.text)

            return BeautifulSoup(req.text, "html.parser")

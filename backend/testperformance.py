import logging
import time
from concurrent.futures import ThreadPoolExecutor

import requests

# source: https://stackoverflow.com/a/68583332/5994461

THREAD_POOL = 16

# This is how to create a reusable connection pool with python requests.
session = requests.Session()
session.mount(
    'https://',
    requests.adapters.HTTPAdapter(pool_maxsize=THREAD_POOL,
                                  max_retries=2,
                                  pool_block=True)
)

def get(url):
    response = session.get(url)
    logging.info("request was completed in %s seconds [%s]", response.elapsed.total_seconds(), response.url)
    if response.status_code != 200:
        logging.error("request failed, error code %s [%s]", response.status_code, response.url)
    if 500 <= response.status_code < 600:
        # server is overloaded? give it a break
        time.sleep(1)
    return response

def download(urls):
    with ThreadPoolExecutor(max_workers=THREAD_POOL) as executor:
        # wrap in a list() to wait for all requests to complete
        return [response.text
                for response in executor.map(get, urls)
                if response.status_code == 200]

def main():
    logging.basicConfig(
        format='%(asctime)s.%(msecs)03d %(levelname)-8s %(message)s',
        level=logging.INFO,
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    urls = [
        "https://httpstat.us/200",
        "https://httpstat.us/200",
        "https://httpstat.us/200",
        "https://httpstat.us/404",
        "https://httpstat.us/503"
    ]

    output = download(urls)
    print(output)

if __name__ == "__main__":
    main()

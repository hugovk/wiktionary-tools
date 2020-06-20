#!/usr/bin/env python
"""
Download lists of all the words from a Wiktionary category,
for example https://en.wiktionary.org/wiki/Category:English_verbs
"""
import argparse
from bs4 import BeautifulSoup  # pip install BeautifulSoup4
import urllib2
from urlparse import urljoin  # Python 2

# from pprint import pprint


def download_page_of_words(url):
    """
    Print out the words in this page
    then return the URL of the next page
    """
    page = urllib2.urlopen(url)
    soup = BeautifulSoup(page.read(), "lxml")

    # pprint(soup)

    pages = soup.find_all("div", id="mw-pages")[0]
    cats = pages.find_all("div", class_="mw-category-group")
    for cat in cats:
        lis = cat.find_all("li")
        for li in lis:
            print(li.text.encode('utf-8'))

    # Find next page
    try:
        next_link = soup.find_all("a", href=True, text="next page")[0]
    except IndexError:
        return False
    href = next_link['href']
    if not href.startswith("http"):
        href = urljoin(url, href)

    return href


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Download words from a Wiktionary category",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        '-s', '--start_url',
        default='https://en.wiktionary.org/wiki/'
                'Category:English_transitive_verbs',
        help="URL of first page of words to start scraping from")
    args = parser.parse_args()

    next_url = args.start_url
    # print("Start:", next_url)
    while(True):
        next_url = download_page_of_words(next_url)
        # print("Next:", next_url)

# End of file

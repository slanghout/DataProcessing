#!/usr/bin/env python
# Name: Sylvie Langhout
# Student number: 10792368
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    
    # Extract a list of highest rated TV series from DOM (of IMDB page).
    # Each TV series entry should contain the following fields:
    # - TV Title
    # - Rating
    # - Genres (comma separated if more than one)
    # - Actors/actresses (comma separated if more than one)
    # - Runtime (only a number!)
    
    # find all serie classes
    series = dom.find_all('div', class_ = 'lister-item mode-advanced')
    
    tvseries = []

    # iterate over the series found and add information to list per show
    for serie in series:
        singleshow = []
        
        # select elements of the series and add to list
        serie_name = serie.h3.a.string
        singleshow.append(serie_name)
        
        serie_rating = serie.strong.text
        singleshow.append(serie_rating)
        
        serie_genre = serie.find('span', class_ = 'genre').string
        serie_genre = serie_genre.strip()
        singleshow.append(serie_genre)
        
        actors = serie.select('p > a')
        serie_actors = []
        for actor in actors: 
            serie_actors.append(actor.find(text = True))
        serie_actors = ",".join(serie_actors)
        singleshow.append(serie_actors)
        
        serie_runtime = serie.find('span', class_ = 'runtime').text 
        serie_runtime = serie_runtime.strip("min")
        singleshow.append(serie_runtime)
        
        tvseries.append(singleshow)

    return tvseries

def save_csv(outfile, tvseries):
    
    # Output a CSV file containing highest rated TV-series.
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write the lists made above into the csv file
    for serie in tvseries:
        writer.writerow(serie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
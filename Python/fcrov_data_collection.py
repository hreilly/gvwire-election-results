# -*- coding: utf-8 -*-
"""
Created on Tue Oct 22 08:32:22 2018

@author: hreilly
"""

import time
starttime=time.time()

while True:
    
    from bs4 import BeautifulSoup
    from bs4 import SoupStrainer
    import pandas as pd
    import requests
    from requests.exceptions import HTTPError
    from requests.exceptions import Timeout
    from requests.exceptions import TooManyRedirects
    
    # Initiate HTTP request

    try:
        
        # Initial request to Fresno County site
        res = requests.get("https://www.co.fresno.ca.us/departments/county-clerk-registrar-of-voters/election-information/election-results/results-for-june-5-2018-statewide-primary-election", allow_redirects=False, timeout=(10, 30))
        
        # Check status
        res.raise_for_status()
        
    except HTTPError:
        
        # Print description of status response
        print('Could not connect to remote source (fcrov_data.py). Trying again in 2 minutes.')
        
        # Time of capture
        t = time.ctime()
        print(t)
        
        # Set timer to try request again
        time.sleep(120.0 - ((time.time() - starttime) % 120.0)) # Update data in 120 sec. intervals since start of last data update.
        
    except Timeout:
        
        print('Connection timed out (fcrov_data.py). Trying again in 2 minutes.')
        
        t = time.ctime()
        print(t)
        
        time.sleep(120.0 - ((time.time() - starttime) % 120.0)) # Update data in 120 sec. intervals since start of last data update.
    
    except TooManyRedirects:
        
        print('Connection attempted a redirect (fcrov_data.py). Trying again in 2 minutes.')
        
        t = time.ctime()
        print(t)
        
        time.sleep(120.0 - ((time.time() - starttime) % 120.0)) # Update data in 120 sec. intervals since start of last data update.
    
    else:
        
        print('Connection successful (fcrov_data.py). Updating again in 10 minutes.')
        
        t = time.ctime()
        print(t)
        
        ########## Begin processing response from HTTP request
        
        # Create filter with SoupStrainer to limit parsing to main div
        res_filter = SoupStrainer('div',{'id': 'widget_328_7137_5329'})
        
        # Grab the strained soup
        soup = BeautifulSoup(res.content,'lxml',parse_only=res_filter)
        
        ########### Cooking soup / breaking down content
        
        # Create an array of tag attributes to remove
        REMOVE_ATTRIBUTES = [
            'style','style','class','border','align','valign','cellpadding',
            'cellspacing','colspan','width']
        
        # Filter out <hr>
        [x.decompose() for x in soup.findAll('hr')]
        
        # Filter out <hr>
        [x.decompose() for x in soup.findAll('br')]
        
        # Filter out <p>
        [x.decompose() for x in soup.findAll('p')]
        
        # Filter out <h3>
        [x.decompose() for x in soup.findAll('h3')]
        
        # Filter out <h2>
        [x.decompose() for x in soup.findAll('h2')]
        
        # Filter out <link>
        [x.decompose() for x in soup.findAll('link')]
        
        # Look for attributes from array and remove, then pass to soup
        for attribute in REMOVE_ATTRIBUTES:
            for tag in soup.find_all():
                del(tag[attribute])
        
        # Print the final result of all filters and functions (disable after data identification)
        # with open("../data/fcrov_data.html", "w") as file:
            # file.write(soup.prettify())
        
        # Convert soup to data frame objects with first row as header
        dfs = pd.read_html(str(soup), header=0)
        
        # Define relevant data frames
        # overview = dfs[0]
        city_council_3 = dfs[64]
        city_council_5 = dfs[66]
        city_council_7 = dfs[68]
        
        # Var for naming cols with no party affiliation
        new_cols = {'Unnamed: 1':'partyPref','Unnamed: 2':'voteNum', 'Unnamed: 3':'votePrcnt'}
        
        # Rename columns in single data frames
        city_council_3.rename(columns = new_cols, inplace = True)
        city_council_5.rename(columns = new_cols, inplace = True)
        city_council_7.rename(columns = new_cols, inplace = True)
        
        # Remove NaNs from data
        city_council_3 = city_council_3.fillna('')
        city_council_5 = city_council_5.fillna('')
        city_council_7 = city_council_7.fillna('')
        
        # All relevant data
        list_df = city_council_3, city_council_5, city_council_7
        
        # Log list (disable in production environment)
        print(list_df)
        
        # Convert data frames to dict and write to JSON
        with open("../data/fcrov_data.json", 'w') as outfile:
            outfile.write(city_council_3.to_json(orient='table'))
            outfile.write(city_council_5.to_json(orient='table'))
            outfile.write(city_council_7.to_json(orient='table'))
        
        # Update data in 10 minute intervals since start of last data update.
        time.sleep(600.0 - ((time.time() - starttime) % 600.0))








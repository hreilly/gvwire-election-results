# -*- coding: utf-8 -*-
"""
Created on Tue Aug 13 09:14:02 2019

@author: hreilly
"""

import time
from bs4 import BeautifulSoup
from bs4 import SoupStrainer
import pandas as pd
from pandas.core.groupby.groupby import DataError
import requests
from requests.exceptions import HTTPError
from requests.exceptions import Timeout
from requests.exceptions import TooManyRedirects

while True:
    
    starttime=time.time()
    
    # Initiate HTTP request

    try:
        
        # Initial request to Fresno County site
        res = requests.get("https://www.co.fresno.ca.us/departments/county-clerk-registrar-of-voters/election-information/election-results/august-13-2019-fresno-city-council-district-2-special-election", allow_redirects=False, timeout=(10, 30))
        
        # Check status
        res.raise_for_status()
        
    except HTTPError:
        
        # Print description of status response
        print('Could not connect to remote source (fcrov_data_08_2019.py). Trying again in 2 minutes...')
        
        # Time of capture
        t = time.ctime()
        print(t)
        
        # Set timer to try request again
        time.sleep(120.0 - ((time.time() - starttime) % 120.0))
        
    except Timeout:
        
        print('Connection timed out (fcrov_data_08_2019.py). Trying again in 2 minutes...')
        
        t = time.ctime()
        print(t)
        
        time.sleep(120.0 - ((time.time() - starttime) % 120.0))
    
    except TooManyRedirects:
        
        print('Connection attempted a redirect (fcrov_data_08_2019.py). Trying again in 2 minutes...')
        
        t = time.ctime()
        print(t)
        
        time.sleep(120.0 - ((time.time() - starttime) % 120.0))
    
    else:
        
        print('Connection successful (fcrov_data_08_2019.py).')
        
        ########## Begin processing response from HTTP request
        
        # Create filter with SoupStrainer to limit parsing to main div | This id may change, watch out
        res_filter = SoupStrainer('div',{'id': 'widget_644_8246_6112'})
        
        # Grab the strained soup
        soup = BeautifulSoup(res.content,'lxml',parse_only=res_filter)
        
        ########### Cooking soup / breaking down content
        
        # Create an array of tag attributes to remove
        REMOVE_ATTRIBUTES = [
            'style','style','class','border','align','valign','cellpadding',
            'cellspacing','colspan','width']
        
        # Filter out <hr>
        [x.decompose() for x in soup.findAll('hr')]
        
        # Filter out <br>
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
        # with open("./data/fcrov_data.html", "w") as file:
            # file.write(soup.prettify())
        
        # ----------------------------------------------- End Soup Functions, Begin Pandas
        
        # Convert soup to data frame objects
        dfs = pd.read_html(str(soup), header=None)
        
        # -------------------------- Define relevant data frames
        time_data = dfs[1]
        overview_data = dfs[2]
        
        # City Council races
        cc2 = dfs[4]
        
        # ----------------------------------------------- End initial df defs
        
        # -------------------------- Season that soup
        # Drop useless rows
        cc2 = cc2.drop(cc2.index[[1,4,5,7,8,9]])
        
        # Var for naming cols
        new_cols = {0:'item', 1:'partyPref', 2:'voteNum', 3:'votePrcnt'}
        time_cols = {2:'time'}
        overview_cols = {0:'voters', 1:'precincts'}
        
        # Rename columns in single data frames
        time_data.rename(columns = time_cols, inplace = True)
        overview_data.rename(columns = overview_cols, inplace = True)
        cc2.rename(columns = new_cols, inplace = True)
        
        # Delete empty columns
        cc2 = cc2.dropna(axis=1, how='all', thresh=None)
        
        # Delete empty rows
        cc2 = cc2.dropna(axis=0, how='all', thresh=None)
        
        # Remove NaNs from data
        cc2 = cc2.fillna('')
        
        # -------------------------- Write data to files
        
        try:
            
            # Servin' it up, Gary's way
            time_data.to_json('./data/time.json', orient='table', index=True)
            overview_data.to_json('./data/overview.json', orient='table', index=True)
            cc2.to_json('./data/cc2.json', orient='table', index=True)
            
        except DataError:
            
            print('Error in pandas data processing (fcrov_data_08_2019.py). Trying again in 2 mins...')
            
            t = time.ctime()
            print(t)
        
            time.sleep(120.0 - ((time.time() - starttime) % 120.0))
        
        except PermissionError:
            
            print('Permission error (fcrov_data_08_2019.py). Check CSV file. Trying again in 2 mins...')
            
            t = time.ctime()
            print(t)
        
            time.sleep(120.0 - ((time.time() - starttime) % 120.0))
        
        else:
            
            print('Write to file successful. Process will refresh in 2 mins...')
            t = time.ctime()
            print(t)
            
            # Log list (disable in production environment)
            # print(list_df)
            
            # Update data in 10 minute intervals since start of last data update.
            # Please sir, may I have some more?
            time.sleep(120.0 - ((time.time() - starttime) % 120.0))




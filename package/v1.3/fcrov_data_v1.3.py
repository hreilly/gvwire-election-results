# -*- coding: utf-8 -*-
"""
Created on Tue Oct 22 08:32:22 2018
Version 1.3, Modified March 2020

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
    
starttime=time.time()

while True:
    
    
    # Initiate HTTP request

    try:
        
        # Initial request to Fresno County site
        res = requests.get("https://www.co.fresno.ca.us/departments/county-clerk-registrar-of-voters/election-information/election-results/results-of-march-3-2020-presidential-primary-election", allow_redirects=False, timeout=(10, 30))
        
        # Check status
        res.raise_for_status()
        
    except HTTPError:
        
        # Print description of status response
        print('Could not connect to remote source (fcrov_data.py). Trying again in 2 minutes...')
        
        # Time of capture
        t = time.ctime()
        print(t)
        
        # Set timer to try request again
        time.sleep(120.0 - ((time.time() - starttime) % 120.0))
        
    except Timeout:
        
        print('Connection timed out (fcrov_data.py). Trying again in 2 minutes...')
        
        t = time.ctime()
        print(t)
        
        time.sleep(120.0 - ((time.time() - starttime) % 120.0))
    
    except TooManyRedirects:
        
        print('Connection attempted a redirect (fcrov_data.py). Trying again in 2 minutes...')
        
        t = time.ctime()
        print(t)
        
        time.sleep(120.0 - ((time.time() - starttime) % 120.0))
    
    else:
        
        print('Connection successful (fcrov_data.py).')
        
        ########## Begin processing response from HTTP request
        
        # Create filter with SoupStrainer to limit parsing to main div | This id may change, watch out
        res_filter = SoupStrainer('div',{'id': 'gems_results'})
        
        # Grab the strained soup
        soup = BeautifulSoup(res.content,'lxml',parse_only=res_filter)
        
        ########### Cooking soup / breaking down content

        soup.p.wrap(soup.new_tag("table"))
        soup.p.wrap(soup.new_tag("tr"))
        soup.p.wrap(soup.new_tag("td"))
        
        # Create an array of tag attributes to remove
        REMOVE_ATTRIBUTES = [
            'style','style','class','border','align','valign','cellpadding',
            'cellspacing','colspan','width']
        
        # Filter out <hr>
        [x.decompose() for x in soup.findAll('hr')]
        
        # Filter out <hr>
        [x.decompose() for x in soup.findAll('br')]
        
        # Filter out <p>
        [x.unwrap() for x in soup.findAll('p')]
        
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
        with open("./data/fcrov_data.html", "w") as file:
            file.write(soup.prettify())
        
        # ----------------------------------------------- End Soup Functions, Begin Pandas
        
        # Convert soup to data frame objects
        dfs = pd.read_html(str(soup), header=None)
        
        # -------------------------- Define relevant data frames
        overview_data = dfs[0]
        
        # Mayor
        may = dfs[52]
        
        # City Council
        cc4 = dfs[56]
        
        # Ballot Measures
        msrA = dfs[64]
        msrC = dfs[66]
        msrM = dfs[76]
        
        # Superior Court Judges
        
        fcscj6 = dfs[42]
        fcscj11 = dfs[44]
        
        # ----------------------------------------------- End initial df defs
        
        # -------------------------- Season that soup
        # Drop useless rows
        may = may.drop(may.index[[0,9]])

        cc4 = cc4.drop(cc4.index[[0,4]])

        msrA = msrA.drop(msrA.index[[0,3]])
        msrC = msrC.drop(msrC.index[[0,3]])
        msrM = msrM.drop(msrM.index[[0,3]])

        fcscj6 = fcscj6.drop(fcscj6.index[[0,3]])
        fcscj11 = fcscj11.drop(fcscj11.index[[0,4]])
        
        # Var for naming cols
        new_cols = {0:'item', 1:'partyPref', 2:'voteNum', 3:'votePrcnt'}
        overview_cols = {0:'item', 1:'partyPref'}
        
        # Rename columns in single data frames

        overview_data.rename(columns = overview_cols, inplace = True)

        may.rename(columns = new_cols, inplace = True)

        cc4.rename(columns = new_cols, inplace = True)

        msrA.rename(columns = new_cols, inplace = True)
        msrC.rename(columns = new_cols, inplace = True)
        msrM.rename(columns = new_cols, inplace = True)

        fcscj6.rename(columns = new_cols, inplace = True)
        fcscj11.rename(columns = new_cols, inplace = True)
        
        # Delete empty columns
        may = may.dropna(axis=1, how='all', thresh=None)

        cc4 = cc4.dropna(axis=1, how='all', thresh=None)

        msrA = msrA.dropna(axis=1, how='all', thresh=None)
        msrC = msrC.dropna(axis=1, how='all', thresh=None)
        msrM = msrM.dropna(axis=1, how='all', thresh=None)

        fcscj6 = fcscj6.dropna(axis=1, how='all', thresh=None)
        fcscj11 = fcscj11.dropna(axis=1, how='all', thresh=None)
        
        # Delete empty rows
        may = may.dropna(axis=0, how='all', thresh=None)

        cc4 = cc4.dropna(axis=0, how='all', thresh=None)

        msrA = msrA.dropna(axis=0, how='all', thresh=None)
        msrC = msrC.dropna(axis=0, how='all', thresh=None)
        msrM = msrM.dropna(axis=0, how='all', thresh=None)

        fcscj6 = fcscj6.dropna(axis=0, how='all', thresh=None)
        fcscj11 = fcscj11.dropna(axis=0, how='all', thresh=None)
        
        # Remove NaNs from data
        may = may.fillna('')

        cc4 = cc4.fillna('')

        msrA = msrA.fillna('')
        msrC = msrC.fillna('')
        msrM = msrM.fillna('')

        fcscj6 = fcscj6.fillna('')
        fcscj11 = fcscj11.fillna('')
        
        # -------------------------- Write data to files
        
        try:
            
            # Servin' it up, Gary's way
            overview_data.to_json('./data/overview.json', orient='table', index=True)

            may.to_json('./data/may.json', orient='table', index=True)

            cc4.to_json('./data/cc4.json', orient='table', index=True)

            msrA.to_json('./data/msrA.json', orient='table', index=True)
            msrC.to_json('./data/msrC.json', orient='table', index=True)
            msrM.to_json('./data/msrM.json', orient='table', index=True)

            fcscj6.to_json('./data/fcscj6.json', orient='table', index=True)
            fcscj11.to_json('./data/fcscj11.json', orient='table', index=True)
            
        except DataError:
            
            print('Error in pandas data processing (fcrov_data.py). Trying again in 2 mins...')
            
            t = time.ctime()
            print(t)
        
            time.sleep(120.0 - ((time.time() - starttime) % 120.0))
        
        except PermissionError:
            
            print('Permission error (fcrov_data.py). Check CSV file. Trying again in 2 mins...')
            
            t = time.ctime()
            print(t)
        
            time.sleep(120.0 - ((time.time() - starttime) % 120.0))
        
        else:
            
            print('Write to file successful. Process will refresh in 10 mins...')
            t = time.ctime()
            print(t)
            
            # Log list (disable in production environment)
            # print(list_df)
            
            # Update data in 10 minute intervals since start of last data update.
            # Please sir, may I have some more?
            time.sleep(600.0 - ((time.time() - starttime) % 600.0))



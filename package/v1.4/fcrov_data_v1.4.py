# -*- coding: utf-8 -*-
"""
Created on Tue Oct 22 08:32:22 2018
Version 1.4, Modified November 2020

@author: hreilly
"""

import time
from bs4 import BeautifulSoup
from bs4 import SoupStrainer
import pandas as pd
from pandas.core.base import DataError
import requests
from requests.exceptions import HTTPError
from requests.exceptions import Timeout
from requests.exceptions import TooManyRedirects
    
starttime=time.time()

while True:
    
    
    # Initiate HTTP request

    try:
        
        # Initial request to Fresno County site
        res = requests.get("https://www.co.fresno.ca.us/departments/county-clerk-registrar-of-voters/election-information/election-results/results-of-november-3-2020-presidential-general-election", allow_redirects=False, timeout=(10, 30))
        
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
        # with open("./data/fcrov_data.html", "w") as file:
           # file.write(soup.prettify())
        
        # ----------------------------------------------- End Soup Functions, Begin Pandas
        
        # Convert soup to data frame objects
        dfs = pd.read_html(str(soup), header=None)
        
        # -------------------------- Define relevant data frames
        overview_data = dfs[0]

        # Fresno County Board of Education
        fcboe2 = dfs[17]
        fcboe3 = dfs[19]

        # SCCCD
        scccd2 = dfs[25]
        scccd3 = dfs[27]
        scccd6 = dfs[29]
        scccd7 = dfs[31]

        # Central Unified School District
        cenusd3 = dfs[35]
        cenusd6 = dfs[37]
        cenusd4 = dfs[39]
        
        # Clovis Unified School District
        cusd2 = dfs[41]
        cusd4 = dfs[43]
        cusd7 = dfs[45]
        
        # Fresno Unified School District
        fusd5 = dfs[56]
        fusd6 = dfs[58]
        
        # Ballot Measures
        msrA = dfs[191]
        msrD = dfs[195]
        
        # ----------------------------------------------- End initial df defs
        
        # -------------------------- Season that soup

        # Drop useless rows
        fcboe2 = fcboe2.drop(fcboe2.index[[0,4]])
        fcboe3 = fcboe3.drop(fcboe3.index[[0,6]])

        scccd2 = scccd2.drop(scccd2.index[[0,5]])
        scccd3 = scccd3.drop(scccd3.index[[0,5]])
        scccd6 = scccd6.drop(scccd6.index[[0,5]])
        scccd7 = scccd7.drop(scccd7.index[[0,5]])

        cenusd3 = cenusd3.drop(cenusd3.index[[0,4]])
        cenusd6 = cenusd6.drop(cenusd6.index[[0,6]])
        cenusd4 = cenusd4.drop(cenusd4.index[[0,4]])

        cusd2 = cusd2.drop(cusd2.index[[0,4]])
        cusd4 = cusd4.drop(cusd4.index[[0,5]])
        cusd7 = cusd7.drop(cusd7.index[[0,4]])

        fusd5 = fusd5.drop(fusd5.index[[0,6]])
        fusd6 = fusd6.drop(fusd6.index[[0,5]])

        msrA = msrA.drop(msrA.index[[0,3]])
        msrD = msrD.drop(msrD.index[[0,3]])
        
        # Var for naming cols
        new_cols = {0:'item', 1:'partyPref', 2:'voteNum', 3:'votePrcnt'}
        overview_cols = {0:'item', 1:'partyPref'}
        
        # Rename columns in single data frames

        overview_data.rename(columns = overview_cols, inplace = True)

        fcboe2.rename(columns = new_cols, inplace = True)
        fcboe3.rename(columns = new_cols, inplace = True)
        
        scccd2.rename(columns = new_cols, inplace = True)
        scccd3.rename(columns = new_cols, inplace = True)
        scccd6.rename(columns = new_cols, inplace = True)
        scccd7.rename(columns = new_cols, inplace = True)

        cenusd3.rename(columns = new_cols, inplace = True)
        cenusd6.rename(columns = new_cols, inplace = True)
        cenusd4.rename(columns = new_cols, inplace = True)

        cusd2.rename(columns = new_cols, inplace = True)
        cusd4.rename(columns = new_cols, inplace = True)
        cusd7.rename(columns = new_cols, inplace = True)

        fusd5.rename(columns = new_cols, inplace = True)
        fusd6.rename(columns = new_cols, inplace = True)

        msrA.rename(columns = new_cols, inplace = True)
        msrD.rename(columns = new_cols, inplace = True)
        
        # Delete empty columns
        fcboe2 = fcboe2.dropna(axis=1, how='all', thresh=None)
        fcboe3 = fcboe3.dropna(axis=1, how='all', thresh=None)

        scccd2 = scccd2.dropna(axis=1, how='all', thresh=None)
        scccd3 = scccd3.dropna(axis=1, how='all', thresh=None)
        scccd6 = scccd6.dropna(axis=1, how='all', thresh=None)
        scccd7 = scccd7.dropna(axis=1, how='all', thresh=None)

        cenusd3 = cenusd3.dropna(axis=1, how='all', thresh=None)
        cenusd6 = cenusd6.dropna(axis=1, how='all', thresh=None)
        cenusd4 = cenusd4.dropna(axis=1, how='all', thresh=None)

        cusd2 = cusd2.dropna(axis=1, how='all', thresh=None)
        cusd4 = cusd4.dropna(axis=1, how='all', thresh=None)
        cusd7 = cusd7.dropna(axis=1, how='all', thresh=None)

        fusd5 = fusd5.dropna(axis=1, how='all', thresh=None)
        fusd6 = fusd6.dropna(axis=1, how='all', thresh=None)

        msrA = msrA.dropna(axis=1, how='all', thresh=None)
        msrD = msrD.dropna(axis=1, how='all', thresh=None)
        
        # Delete empty rows
        fcboe2 = fcboe2.dropna(axis=0, how='all', thresh=None)
        fcboe3 = fcboe3.dropna(axis=0, how='all', thresh=None)

        scccd2 = scccd2.dropna(axis=0, how='all', thresh=None)
        scccd3 = scccd3.dropna(axis=0, how='all', thresh=None)
        scccd6 = scccd6.dropna(axis=0, how='all', thresh=None)
        scccd7 = scccd7.dropna(axis=0, how='all', thresh=None)

        cenusd3 = cenusd3.dropna(axis=0, how='all', thresh=None)
        cenusd6 = cenusd6.dropna(axis=0, how='all', thresh=None)
        cenusd4 = cenusd4.dropna(axis=0, how='all', thresh=None)

        cusd2 = cusd2.dropna(axis=0, how='all', thresh=None)
        cusd4 = cusd4.dropna(axis=0, how='all', thresh=None)
        cusd7 = cusd7.dropna(axis=0, how='all', thresh=None)

        fusd5 = fusd5.dropna(axis=0, how='all', thresh=None)
        fusd6 = fusd6.dropna(axis=0, how='all', thresh=None)

        msrA = msrA.dropna(axis=0, how='all', thresh=None)
        msrD = msrD.dropna(axis=0, how='all', thresh=None)
        
        # Remove NaNs from data
        fcboe2 = fcboe2.fillna('')

        scccd2 = scccd2.fillna('')
        scccd3 = scccd3.fillna('')
        scccd6 = scccd6.fillna('')
        scccd7 = scccd7.fillna('')
        
        cenusd3 = cenusd3.fillna('')
        cenusd6 = cenusd6.fillna('')
        cenusd4 = cenusd4.fillna('')

        cusd2 = cusd2.fillna('')
        cusd4 = cusd4.fillna('')
        cusd7 = cusd7.fillna('')

        fusd5 = fusd5.fillna('')
        fusd6 = fusd6.fillna('')

        msrA = msrA.fillna('')
        msrD = msrD.fillna('')
        
        # -------------------------- Write data to files
        
        try:
            
            # Servin' it up, Gary's way
            overview_data.to_json('./data/overview.json', orient='table')

            fcboe2.to_json('./data/fcboe2.json', orient='table')
            fcboe3.to_json('./data/fcboe3.json', orient='table')

            scccd2.to_json('./data/scccd2.json', orient='table')
            scccd3.to_json('./data/scccd3.json', orient='table')
            scccd6.to_json('./data/scccd6.json', orient='table')
            scccd7.to_json('./data/scccd7.json', orient='table')

            cenusd3.to_json('./data/cenusd3.json', orient='table')
            cenusd6.to_json('./data/cenusd6.json', orient='table')
            cenusd4.to_json('./data/cenusd4.json', orient='table')

            cusd2.to_json('./data/cusd2.json', orient='table')
            cusd4.to_json('./data/cusd4.json', orient='table')
            cusd7.to_json('./data/cusd7.json', orient='table')

            fusd5.to_json('./data/fusd5.json', orient='table')
            fusd6.to_json('./data/fusd6.json', orient='table')

            msrA.to_json('./data/msrA.json', orient='table')
            msrD.to_json('./data/msrD.json', orient='table')
            
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



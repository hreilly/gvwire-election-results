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
    from pandas.core.groupby.groupby import DataError
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
        
        # ----------------------------------------------- End Soup Functions, Begin Pandas
        
        # Convert soup to data frame objects
        dfs = pd.read_html(str(soup), header=None)
        
        # -------------------------- Define relevant data frames
        overview_data = dfs[3]
        
        # City Council races
        cc3 = dfs[64]
        cc5 = dfs[66]
        cc7 = dfs[68]
        
        # Ballot measures
        msrA = dfs[4]
        msrO = dfs[6]
        msrP = dfs[8]
        msrQ = dfs[10]
        
        # Controller/Treasurer
        fcTrsr = dfs[12]
        
        # Fresno Unified School District
        fusd1 = dfs[14]
        fusd3 = dfs[16]
        fusd4 = dfs[18]
        fusd7 = dfs[20]
        
        # Central Unified School District
        cenusd1 = dfs[22]
        cenusd2 = dfs[24]
        cenusd4 = dfs[26]
        cenusd7 = dfs[28]
        
        # Clovis Unified School District
        
        cusd1 = dfs[30]
        cusd3 = dfs[32]
        
        # ----------------------------------------------- End initial df defs
        
        # -------------------------- Season that soup
        
        # Drop useless rows
        cc3 = cc3.drop(cc3.index[[1,4,5,7,8,9]])
        cc5 = cc5.drop(cc5.index[[1,4,5,7,8,9]])
        cc7 = cc7.drop(cc7.index[[1,4,5,7,8,9]])
        msrA = msrA.drop(msrA.index[[1,4,5,7,8,9]])
        msrO = msrO.drop(msrO.index[[1,4,5,7,8,9]])
        msrP = msrP.drop(msrP.index[[1,4,5,7,8,9]])
        msrQ = msrQ.drop(msrQ.index[[1,4,5,7,8,9]])
        fcTrsr = fcTrsr.drop(fcTrsr.index[[1,4,5,7,8,9]])
        fusd1 = fusd1.drop(fusd1.index[[1,4,5,7,8,9]])
        fusd3 = fusd3.drop(fusd3.index[[1,4,5,7,8,9]])
        fusd4 = fusd4.drop(fusd4.index[[1,4,5,7,8,9]])
        fusd7 = fusd7.drop(fusd7.index[[1,4,5,7,8,9]])
        cenusd1 = cenusd1.drop(cenusd1.index[[1,4,5,7,8,9]])
        cenusd2 = cenusd2.drop(cenusd2.index[[1,4,5,7,8,9]])
        cenusd4 = cenusd4.drop(cenusd4.index[[1,4,5,7,8,9]])
        cenusd7 = cenusd7.drop(cenusd7.index[[1,4,5,7,8,9]])
        cusd1 = cusd1.drop(cusd1.index[[1,4,5,7,8,9]])
        cusd3 = cusd3.drop(cusd3.index[[1,4,5,7,8,9]])
        
        # Var for naming cols
        new_cols = {0:'item', 1:'partyPref', 2:'voteNum', 3:'votePrcnt'}
        
        # Rename columns in single data frames
        cc3.rename(columns = new_cols, inplace = True)
        cc5.rename(columns = new_cols, inplace = True)
        cc7.rename(columns = new_cols, inplace = True)
        msrA.rename(columns = new_cols, inplace = True)
        msrO.rename(columns = new_cols, inplace = True)
        msrP.rename(columns = new_cols, inplace = True)
        msrQ.rename(columns = new_cols, inplace = True)
        fcTrsr.rename(columns = new_cols, inplace = True)
        fusd1.rename(columns = new_cols, inplace = True)
        fusd3.rename(columns = new_cols, inplace = True)
        fusd4.rename(columns = new_cols, inplace = True)
        fusd7.rename(columns = new_cols, inplace = True)
        cenusd1.rename(columns = new_cols, inplace = True)
        cenusd2.rename(columns = new_cols, inplace = True)
        cenusd4.rename(columns = new_cols, inplace = True)
        cenusd7.rename(columns = new_cols, inplace = True)
        cusd1.rename(columns = new_cols, inplace = True)
        cusd3.rename(columns = new_cols, inplace = True)
        
        # Delete empty columns
        cc3 = cc3.dropna(axis=1, how='all', thresh=None)
        cc5 = cc5.dropna(axis=1, how='all', thresh=None)
        cc7 = cc7.dropna(axis=1, how='all', thresh=None)
        msrA = msrA.dropna(axis=1, how='all', thresh=None)
        msrO = msrO.dropna(axis=1, how='all', thresh=None)
        msrP = msrP.dropna(axis=1, how='all', thresh=None)
        msrQ = msrQ.dropna(axis=1, how='all', thresh=None)
        fcTrsr = fcTrsr.dropna(axis=1, how='all', thresh=None)
        fusd1 = fusd1.dropna(axis=1, how='all', thresh=None)
        fusd3 = fusd3.dropna(axis=1, how='all', thresh=None)
        fusd4 = fusd4.dropna(axis=1, how='all', thresh=None)
        fusd7 = fusd7.dropna(axis=1, how='all', thresh=None)
        cenusd1 = cenusd1.dropna(axis=1, how='all', thresh=None)
        cenusd2 = cenusd2.dropna(axis=1, how='all', thresh=None)
        cenusd4 = cenusd4.dropna(axis=1, how='all', thresh=None)
        cenusd7 = cenusd7.dropna(axis=1, how='all', thresh=None)
        cusd1 = cusd1.dropna(axis=1, how='all', thresh=None)
        cusd3 = cusd3.dropna(axis=1, how='all', thresh=None)
        
        # Delete empty rows
        cc3 = cc3.dropna(axis=0, how='all', thresh=None)
        cc5 = cc5.dropna(axis=0, how='all', thresh=None)
        cc7 = cc7.dropna(axis=0, how='all', thresh=None)
        msrA = msrA.dropna(axis=0, how='all', thresh=None)
        msrO = msrO.dropna(axis=0, how='all', thresh=None)
        msrP = msrP.dropna(axis=0, how='all', thresh=None)
        msrQ = msrQ.dropna(axis=0, how='all', thresh=None)
        fcTrsr = fcTrsr.dropna(axis=0, how='all', thresh=None)
        fusd1 = fusd1.dropna(axis=0, how='all', thresh=None)
        fusd3 = fusd3.dropna(axis=0, how='all', thresh=None)
        fusd4 = fusd4.dropna(axis=0, how='all', thresh=None)
        fusd7 = fusd7.dropna(axis=0, how='all', thresh=None)
        cenusd1 = cenusd1.dropna(axis=0, how='all', thresh=None)
        cenusd2 = cenusd2.dropna(axis=0, how='all', thresh=None)
        cenusd4 = cenusd4.dropna(axis=0, how='all', thresh=None)
        cenusd7 = cenusd7.dropna(axis=0, how='all', thresh=None)
        cusd1 = cusd1.dropna(axis=0, how='all', thresh=None)
        cusd3 = cusd3.dropna(axis=0, how='all', thresh=None)
        
        # Remove NaNs from data
        cc3 = cc3.fillna('')
        cc5 = cc5.fillna('')
        cc7 = cc7.fillna('')
        msrA = msrA.fillna('')
        msrO = msrO.fillna('')
        msrP = msrP.fillna('')
        msrQ = msrQ.fillna('')
        fcTrsr = fcTrsr.fillna('')
        fusd1 = fusd1.fillna('')
        fusd3 = fusd3.fillna('')
        fusd4 = fusd4.fillna('')
        fusd7 = fusd7.fillna('')
        cenusd1 = cenusd1.fillna('')
        cenusd2 = cenusd2.fillna('')
        cenusd4 = cenusd4.fillna('')
        cenusd7 = cenusd7.fillna('')
        cusd1 = cusd1.fillna('')
        cusd3 = cusd3.fillna('')
        
        # -------------------------- Write data to files
        
        try:
            
            # Servin' it up, Gary's way
            cc3.to_json('./data/cc3.json', orient='table', index=True)
            cc5.to_json('./data/cc5.json', orient='table', index=True)
            cc7.to_json('./data/cc7.json', orient='table', index=True)
            msrA.to_json('./data/msrA.json', orient='table', index=True)
            msrO.to_json('./data/msrO.json', orient='table', index=True)
            msrP.to_json('./data/msrP.json', orient='table', index=True)
            msrQ.to_json('./data/msrQ.json', orient='table', index=True)
            fcTrsr.to_json('./data/fcTrsr.json', orient='table', index=True)
            fusd1.to_json('./data/fusd1.json', orient='table', index=True)
            fusd3.to_json('./data/fusd3.json', orient='table', index=True)
            fusd4.to_json('./data/fusd4.json', orient='table', index=True)
            fusd7.to_json('./data/fusd7.json', orient='table', index=True)
            cenusd1.to_json('./data/cenusd1.json', orient='table', index=True)
            cenusd2.to_json('./data/cenusd2.json', orient='table', index=True)
            cenusd4.to_json('./data/cenusd4.json', orient='table', index=True)
            cenusd7.to_json('./data/cenusd7.json', orient='table', index=True)
            cusd1.to_json('./data/cusd1.json', orient='table', index=True)
            cusd3.to_json('./data/cusd3.json', orient='table', index=True)
            
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



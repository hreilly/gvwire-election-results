# -*- coding: utf-8 -*-
"""
Created on Tue Oct 22 08:32:22 2018

@author: hreilly
"""

#import time
#starttime=time.time()

#while True:
    
from bs4 import BeautifulSoup
from bs4 import SoupStrainer
import pandas as pd
import requests
import json

"""
Prepping the ingredients / highest level elements
"""

# Initial request to Fresno County site
res = requests.get(
    "https://www.co.fresno.ca.us/departments/county-clerk-registrar-of-voters/election-information/election-results/results-for-june-5-2018-statewide-primary-election")

# Create filter with SoupStrainer to limit parsing to main div
res_filter = SoupStrainer('div',{'id': 'widget_328_7137_5329'})

# Grab the strained soup
soup = BeautifulSoup(res.content,'lxml',parse_only=res_filter)

"""
Cooking soup / breaking down content / Print to HTML file for analysis
"""

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

# Look for attributes and remove, then pass
for attribute in REMOVE_ATTRIBUTES:
    for tag in soup.find_all():
        del(tag[attribute])

# Print the final result of all filters and functions
# with open("../data/fcrov_data.html", "w") as file:
    # file.write(soup.prettify())

# Convert soup to data frame objects
dfs = pd.read_html(str(soup), header=0)

# Naming relevant data frames
city_council_3 = dfs[64]
city_council_5 = dfs[66]
city_council_7 = dfs[68]

# Var for naming cols
new_cols = {'Unnamed: 1':'partyPref', 'Unnamed: 2':'voteNum', 'Unnamed: 3':'votePrcnt'}

# Rename columns in single data frames
city_council_5.rename(columns = new_cols, inplace = True)
city_council_3.rename(columns = new_cols, inplace = True)
city_council_7.rename(columns = new_cols, inplace = True)

list_df = [city_council_3, city_council_5, city_council_7]

print(list_df)

with open("../data/fcrov_data.json", 'w') as outfile:
    outfile.write(json.dumps([dfs.to_dict() for dfs in list_df]))
    
    #time.sleep(120.0 - ((time.time() - starttime) % 120.0)) # Update data in 60 sec. intervals since start of last data update.








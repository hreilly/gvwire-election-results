#import time
#starttime=time.time()

#while True:
    
import pandas as pd
import requests
from bs4 import BeautifulSoup

# Highest level content

source = requests.get("https://www.co.fresno.ca.us/departments/county-clerk-registrar-of-voters/election-information/election-results/results-for-june-5-2018-statewide-primary-election") # Grab data from the Fresno County Registrar of Voters website
soup = BeautifulSoup(source.text,'lxml') # Grab the whole page with BS4
data = soup.find(id="widget_328_7137_5329") # Locate main results div

# Handling data

dfs = pd.read_html(str(data))
df = pd.concat(dfs[2:10])
df.to_json('fcrov_data.json', orient='records')
    
    #time.sleep(60.0 - ((time.time() - starttime) % 60.0)) # Update data in 60 sec. intervals since start of last data update.

from bs4 import BeautifulSoup
from bs4 import SoupStrainer
import pandas as pd
import numpy as np
import requests

res = requests.get(
    "https://www.co.fresno.ca.us/departments/county-clerk-registrar-of-voters/election-information/election-results/results-for-june-5-2018-statewide-primary-election")

REMOVE_ATTRIBUTES = [
    'style','style','class','border','align','cellpadding',
    'cellspacing','colspan','width']
REMOVE_TAGS = ['hr/']

# Create filter with SoupStrainer to limit parsing to main div
res_filter = SoupStrainer('div',{'id': 'widget_328_7137_5329'})

soup = BeautifulSoup(res.content,'lxml',parse_only=res_filter)

# Filter out <hr>
[x.decompose() for x in soup.findAll('hr')]

# Filter out <p>
[x.decompose() for x in soup.findAll('p')]

# Look for attributes and remove, then pass
for attribute in REMOVE_ATTRIBUTES:
    for tag in soup.find_all():
        del(tag[attribute])
        
# Filter out empty "td" tags
# empty_td_tags = soup.findAll(lambda tag: tag.name == 'td' and not tag.contents and (tag.string is None or not tag.string.strip()))
# [empty_tag.decompose() for empty_tag in empty_td_tags]

# Print the final result of all filters and functions
with open("fcrov_data.html", "w") as file:
    file.write(str(soup))
    
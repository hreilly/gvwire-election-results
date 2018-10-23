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
    
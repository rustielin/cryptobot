#!/usr/bin/python

import pandas as pd 
import seaborn as sns
import matplotlib.pyplot as plt 
import os

from datetime import datetime, timedelta, timezone
from pytz import timezone

CSV_PATH = os.getenv('CSV_PATH')
PNG_PATH = os.getenv('PNG_PATH')

# load in the DF
pricedf = pd.read_csv(CSV_PATH, parse_dates=['timestamp'])
pricedf = pricedf.set_index("timestamp")

# get the last 24 hours only
start = datetime.now(tz=timezone('UTC'))
end = (start - timedelta(days=1))
pricedf = pricedf[(pricedf.index >= end ) & (pricedf.index <= start)]

# init 
fig, ax = plt.subplots(figsize=(10, 10))

# make the graph
g = sns.lineplot(ax=ax, x=pricedf.index, y="price", data=pricedf)

sub_index = pricedf.index[::60] #  roughly every hour
ax.set_xticks(sub_index) # not sure if needed
ax.set_xticklabels([x.strftime('%Y-%m-%d\n %H:%M:%S') for x in sub_index], rotation=50)
plt.title("Price of BTC over time \nlast updated {}".format(pricedf.index[-1]))

# write to file and log
fig.savefig(PNG_PATH)
#!/usr/bin/python

import pandas as pd 
import seaborn as sns
import matplotlib.pyplot as plt 
import matplotlib.dates as mdates
import os

from datetime import datetime, timedelta, timezone
from pytz import timezone

CSV_PATH = os.getenv('CSV_PATH')
PNG_PATH = os.getenv('PNG_PATH')

# formatting
mnr_hrs = mdates.HourLocator(interval=4)
hrs_fmt = mdates.DateFormatter('%Y-%m-%d\n %H:%M UTC')
hrs = mdates.HourLocator()

# load in the DF
pricedf = pd.read_csv(CSV_PATH, parse_dates=['timestamp'])
pricedf = pricedf.set_index("timestamp")

# get the last 24 hours only
start = datetime.now(tz=timezone('UTC'))
end = (start - timedelta(days=1))
pricedf = pricedf[(pricedf.index >= end ) & (pricedf.index <= start)]

# init 
fig, ax = plt.subplots(figsize=(10, 10))

# get the hr labels
ax.xaxis.set_major_locator(mnr_hrs)
ax.xaxis.set_major_formatter(hrs_fmt)
ax.xaxis.set_minor_locator(hrs)

fig.autofmt_xdate()

# make the graph
g = sns.lineplot(ax=ax, x=pricedf.index, y="price", data=pricedf)

plt.title("Price of BTC over time \nlast updated {}".format(pricedf.index[-1]))

# write to file and log
fig.savefig(PNG_PATH)
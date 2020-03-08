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
mjr_hrs = mdates.HourLocator(interval=4)
hrs_fmt = mdates.DateFormatter('%Y-%m-%d\n %H:%M UTC')
hrs = mdates.HourLocator()

mjr_days = mdates.DayLocator()
days_fmt = mdates.DateFormatter('%Y-%m-%d')
days = mdates.HourLocator(interval=6)

# load in the DF
pricedf = pd.read_csv(CSV_PATH, parse_dates=['timestamp'])
pricedf = pricedf.set_index("timestamp")

# get the last 24 hours only
start = datetime.now(tz=timezone('UTC'))
end = start - timedelta(days=1)
pricedf_days = pricedf[(pricedf.index >= end ) & (pricedf.index <= start)]
pricedf_days['mavg'] = pricedf_days['price'].rolling(window=5).mean()

# get the last week only
end_week = start - timedelta(days=7)
pricedf_week = pricedf[(pricedf.index >= end_week ) & (pricedf.index <= start)]
pricedf_week['mavg'] = pricedf_week['price'].rolling(window=60).mean()

# init 
fig, (ax, ax2) = plt.subplots(1,2, figsize=(20, 10))

# get the hr labels
ax.xaxis.set_major_locator(mjr_hrs)
ax.xaxis.set_major_formatter(hrs_fmt)
ax.xaxis.set_minor_locator(hrs)

# make the graph
g = sns.lineplot(ax=ax, x=pricedf_days.index, y="price", data=pricedf_days, label='price (minute)')
sns.lineplot(ax=ax, x=pricedf_days.index, y="mavg", data=pricedf_days, label='mavg (<5 min)')
g.set(title="Price of BTC over past 24 hours")


# get the labels
ax2.xaxis.set_major_locator(mjr_days)
ax2.xaxis.set_major_formatter(days_fmt)
ax2.xaxis.set_minor_locator(days)

g2 = sns.lineplot(ax=ax2, x=pricedf_week.index, y="price", data=pricedf_week, label='price (minute)')
sns.lineplot(ax=ax2, x=pricedf_week.index, y="mavg", data=pricedf_week, label='price (<1 hr)')
g2.set(title="Price of BTC over past week")

# global stuff
fig.autofmt_xdate()
fig.suptitle("last updated {}".format(pricedf_week.index[-1]))

# write to file and log
fig.savefig(PNG_PATH)
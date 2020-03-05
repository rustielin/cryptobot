#!/usr/bin/python

import pandas as pd 
import seaborn as sns
import matplotlib.pyplot as plt 
import os

from datetime import datetime

CSV_PATH = os.getenv('CSV_PATH')
PNG_PATH = os.getenv('PNG_PATH')

pricedf = pd.read_csv(CSV_PATH, parse_dates=['timestamp'])

fig, ax = plt.subplots(figsize=(10, 10))

g = sns.lineplot(ax=ax, x="timestamp", y="price", marker="o", data=pricedf)

ax.set_xticks(pricedf["timestamp"])
ax.set_xticklabels([x.strftime('%Y-%m-%d\n %H:%M:%S') for x in pricedf["timestamp"]], rotation=50)
plt.title('Price of BTC over time')

fig.savefig(PNG_PATH)

print(pricedf)
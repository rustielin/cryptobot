#!/bin/sh

export CSV_PATH="$HOME/public_html/btc-usd.csv"
export PNG_PATH="$HOME/public_html/btc-usd.png"

node btc_bot.js

python write_graph.py

node send_slack.js
#!/bin/bash

export CSV_PATH="$HOME/public_html/btc-usd.csv"
export PNG_PATH="$HOME/public_html/btc-usd.png"
export LOG_PATH="$HOME/public_html/bot.log"

# make sure it exists first per run
touch $LOG_PATH 
touch $CSV_PATH
touch $PNG_PATH

# how many seconds to sleep between new entries
SLEEP_SECS=60

# keep around 50 lines in the log
TAIL_LINES=1000

# dry run disabled at first
DRY=0

# utility function to log with timestamp
# XXX: probably add a verbose option
log() {
    echo $(date): "$@" >> $LOG_PATH
}

print_usage() {
    echo "usage: ./test.sh [hid]"
    echo "    -h      print help"
    echo "    -i      enter python interactive mode after execution"
    echo "    -d      dry run, on calculating graph"
    exit
}

while getopts 'hid' flag; do
    case "${flag}" in 
        i) I="-i" ;;
        h) print_usage ;;
        d) DRY=1
    esac
done

if [ ! -d "./venv" ]; then 
    log "venv not found in $(pwd)"
    exit 1
fi

log "Using $(pwd)/venv"

. venv/bin/activate

log "Starting ./run.sh, scraping every $SLEEP_SECS seconds..."

# dry run that prints test output, and exits
if [ "$DRY" -eq "1" ]; then
    log "--------- MANUAL DRY RUN ---------"
    export TEST_FILE="btc-usd_test-$(echo $RANDOM).png"
    export PNG_PATH="$HOME/public_html/test/$TEST_FILE"
    touch $PNG_PATH
    log "TEST OUTPUT: https://www.ocf.berkeley.edu/~$USER/test/$TEST_FILE"
    python -W $I ignore write_graph.py >> $LOG_PATH
    exit
fi


while true  
do      
    log "--------- NEW RUN ---------"

    log "running btc_bot"
    node btc_bot.js >> $LOG_PATH

    log "creating graph"
    python -W ignore write_graph.py >> $LOG_PATH

    # node send_slack.js # disabled for now, introduce a threshold later

    log "Sleeping $SLEEP_SECS seconds..."

    # Cut the log when we're greater than $TAIL_LINES length
    NUM_LINES=$(wc -l < $LOG_PATH)
    if [ "$NUM_LINES" -ge "$TAIL_LINES" ]; then
        truncate -s 0 $LOG_PATH
        echo "LOGGG"
        log "--------- LOG CUTTER!!! ---------"
    fi

    sleep $SLEEP_SECS
done
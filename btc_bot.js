const rp = require('request-promise');
const fs = require('fs')
var csvWriter = require('csv-write-stream')

// get consts defined for us
const { CMC_PRO_API_KEYS, SLACK_WEBHOOK } = require('./config.js')
const RAND_KEY = CMC_PRO_API_KEYS[Math.floor(Math.random() * CMC_PRO_API_KEYS.length)]
const CSV_PATH = process.env.CSV_PATH;
const PNG_PATH = process.env.PNG_PATH;
const LATEST_PRICE_PATH = process.env.LATEST_PRICE_PATH;

// derive the URLs
// XXX: fix this hardcode
const IMAGE_URL = 'https://www.ocf.berkeley.edu/~rustielin/btc-usd.png'

// some consts we define
// if BTC hourly price changes past this threshold, alert slack
const THRESHOLD_HOURLY = 0.5 

// get the CSV ready
var writer = null;
if (!fs.existsSync(CSV_PATH))
  writer = csvWriter({ headers: ["price", "timestamp"]});
else
  writer = csvWriter({sendHeaders: false});


const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '1',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': RAND_KEY
  },
  json: true,
  gzip: true
};


rp(requestOptions).then(response => {

  // parse the response
  var timestamp = response.status.timestamp;
  var price = response.data[0].quote.USD.price;
  var change = response.data[0].quote.USD.percent_change_1h

  // some debug logs... delet this
  console.log("1hr price change:", change, "abs:", Math.abs(change))

  // write CSV
  writer.pipe(fs.createWriteStream(CSV_PATH, {flags: 'a'}))
  writer.write({price: price, timestamp: timestamp})
  writer.end()

  return {
    timestamp: timestamp,
    price: price,
    change: change
  }


}).then(res => {
  const timestamp = res.timestamp;
  const price = res.price;
  const change = res.change;

  console.log("NEW THEN", res)

  const slackOptions = {
    method: 'POST',
    uri: SLACK_WEBHOOK,
    body: {
        // hardcoded for now lol
        text: '[' + timestamp + '] Bitcoin Price:' + price + ", hourly change: " + change + "%",
        attachments: [
          {
            fallback: "uwu i'm a fallback text! don't look at me >:(",
            image_url: IMAGE_URL,
            thumb_url: IMAGE_URL,
          }
        ]
    },
    json: true,
  }
  if (Math.abs(change) > THRESHOLD_HOURLY ) {
    rp(slackOptions).then(response => {
      console.log('Sent to Slack', response);
    }).catch((err) => {
      console.log('Slack send error:', err.message);
    });
  }

}).catch((err) => {
  console.log('API call error:', err.message);
});

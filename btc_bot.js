const rp = require('request-promise');
const {CMC_PRO_API_KEY, SLACK_WEBHOOK} = require('config.js')

const requestOptions = {
  method: 'GET',
  uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
  qs: {
    'start': '1',
    'limit': '1',
    'convert': 'USD'
  },
  headers: {
    'X-CMC_PRO_API_KEY': CMC_PRO_API_KEY
  },
  json: true,
  gzip: true
};


rp(requestOptions).then(response => {
  console.log('[', response.status.timestamp, '] Bitcoin Price:', response.data[0].quote.USD.price);
  const slackOptions = {
    method: 'POST',
    uri: SLACK_WEBHOOK,
    body: {
      text: '[' + response.status.timestamp + '] Bitcoin Price: *' + response.data[0].quote.USD.price + '*',
    },
    json: true,
  }
  // slackOptions.body.text = response.data[0].quote.USD.price;
  rp(slackOptions);
}).catch((err) => {
  console.log('API call error:', err.message);
});

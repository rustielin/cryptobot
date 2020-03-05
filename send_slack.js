const rp = require('request-promise');

const { SLACK_WEBHOOK } = require('./config.js')

const slackOptions = {
    method: 'POST',
    uri: SLACK_WEBHOOK,
    body: {
        // hardcoded for now lol
        text: "text https://www.ocf.berkeley.edu/~rustielin/btc-usd.png",
        fallback: "fallback https://www.ocf.berkeley.edu/~rustielin/btc-usd.png",
        image_url: 'https://www.ocf.berkeley.edu/~rustielin/btc-usd.png',
        thumb_url: 'https://www.ocf.berkeley.edu/~rustielin/btc-usd.png',
    },
    json: true,
}
rp(slackOptions).then(response => {
    console.log('Sent to Slack', response);
}).catch((err) => {
    console.log('Slack send error:', err.message);
});
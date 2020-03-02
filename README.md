# Cryptobot 

## Quickstart

0. clone the repo: 

```
git clone github.com/gzhao408/cryptobot
```

1. Go to coinmarketcap.com and make an account. 

2. Go to your slack and make a new incoming webhoook.

3. Create a file called `config.js` with the following contents: 

```js
const SLACK_WEBHOOK = 'YOUR WEBHOOK HERE'
const CMC_PRO_API_KEY = 'YOUR API KEY HERE'

module.exports = {
  SLACK_WEBHOOK,
  CMC_PRO_API_KEY
}

```

4. run `npm install` and `node btc_bot.js`. It should send the output to your slack channel.

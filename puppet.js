const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto('https://coinmarketcap.com/currencies/bitcoin/', {waitUntil: 'domcontentloaded', timeout: 5000});
    // await sleep(10000)
    // await page.waitForSelector('.highcharts-container')
    // const selector = '.highcharts-container';
    // const rect = await page.evaluate(selector => {
    //     const element = document.querySelector(selector);
    //     const {x, y, width, height} = element.getBoundingClientRect();
    //     return {left: x, top: y, width, height, id: element.id};
    // }, selector);

    await page.screenshot({
        // e.g. PIC_DUMP='/home/r/ru/rustielin/public_html/example.png'
        path: process.env.PIC_DUMP,
        // fullPage: true // XXX: removing this comment induces crash by memory overload
    });

    // async function screenshotDOMElement(selector, padding = 0) {
    //     const rect = await page.evaluate(selector => {
    //       const element = document.querySelector(selector);
    //       const {x, y, width, height} = element.getBoundingClientRect();
    //       return {left: x, top: y, width, height, id: element.id};
    //     }, selector);
      
    //     return await page.screenshot({
    //       path: 'element.png',
    //       clip: {
    //         x: rect.left - padding,
    //         y: rect.top - padding,
    //         width: rect.width + padding * 2,
    //         height: rect.height + padding * 2
    //       }
    //     });
    //   }
      
    // await screenshotDOMElement('.highcharts-container', 16);
    await browser.close();
}

// Start the script
main();

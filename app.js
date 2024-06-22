const fs = require('fs');

const baseCurrency = 'INR';
const targetCurrency = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'RUB'];

async function scrape() {
  const data = {};
  const date = new Date();
  data.baseCurrency = baseCurrency;
  data.lastUpdated = date.toISOString();
  data.date = date.toISOString().split('T')[0];
  data.rates = [];
  const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

  for (let i = 0; i < targetCurrency.length; i++) {
    const url = `https://www.google.com/search?q=1+${targetCurrency[i]}+to+${baseCurrency}`;
    try {
      const response = await (await fetch(url, { headers: { 'User-Agent': userAgent } })).text();
      const rate = {};
      rate.currency = targetCurrency[i];
      const value = response.match(/data-value="(.+?)"/)[1];
      rate.value = value ? Math.round(value * 100) / 100 : null;
      data.rates.push(rate);
    } catch (error) {
      console.error(error);
    }
  }
  return data;
}

(async () => {
  const startTime = performance.now();
  const data = await scrape();
  const endTime = performance.now();
  console.log(`Time taken: ${endTime - startTime}ms`);
  if (data && data.rates && Array.isArray(data.rates) && data.rates.length > 0) {
    fs.writeFile('exchange-rates.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
})();

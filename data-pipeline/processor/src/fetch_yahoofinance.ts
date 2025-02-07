const yahooFinance = require('yahoo-finance2').default;

async function getHistoricalData(symbol:string): Promise<any> {
  const queryOptions = { period1: '2022-02-05', period2: '2023-02-05', interval: '1d' };
  try {
    const result = await yahooFinance.historical(symbol, queryOptions);
    return result;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    return null;
  }
}

async function main() {
  const nasdaqData = await getHistoricalData('^IXIC'); // NASDAQ Composite Index
 // const sp500Data = await getHistoricalData('^GSPC'); // S&P 500 Index

  if (nasdaqData) {
    for (const data of nasdaqData) {
      console.log('Date:', data.date, 'Close:', data.close)
    }
  }

//   if (sp500Data) {
//     console.log('S&P 500 Historical Data:', sp500Data);
//   }
}

main();
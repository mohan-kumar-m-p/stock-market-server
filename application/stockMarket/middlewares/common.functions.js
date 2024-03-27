const request = require('request');

const apiKey = process.env.ALPHA_KEY;

function getSearchAlphavantage (symbol) {
  return new Promise((resolve, reject) => {

    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;

    request.get({
      url: url,
      json: true,
      headers: { 'User-Agent': 'request' }
    }, (err, res, data) => {
      if (err) {
        reject(new Error(err.message));
      } else if (res.statusCode !== 200) {
        resolve({ status: res.statusCode });
      } else {

        const allowedKeys = [
          'Symbol',
          'AssetType',
          'Name',
          'Description',
          'CIK',
          'Exchange',
          'Currency',
          'Country',
          'Sector',
          'Industry',
          'Address',
          'FiscalYearEnd',
          'LatestQuarter',
          'MarketCapitalization',
          'EBITDA',
          'PERatio',
          'PEGRatio',
          'BookValue',
          'DividendPerShare',
          'DividendYield',
          'ProfitMargin',
          'QuarterlyEarningsGrowthYOY',
          'QuarterlyRevenueGrowthYOY',
          'AnalystTargetPrice',
          'AnalystRatingStrongBuy',
          'AnalystRatingBuy',
          'AnalystRatingHold',
          'AnalystRatingSell',
          'AnalystRatingStrongSell',
          '52WeekHigh',
          '52WeekLow',
          '50DayMovingAverage',
          '200DayMovingAverage',
          'SharesOutstanding',
          'DividendDate',
          'ExDividendDate'
        ];

        const filteredData = Object.keys(data)
          .filter(key => allowedKeys.includes(key))
          .reduce((obj, key) => {
            if (key == '52WeekHigh') {
              obj['s52WeekHigh'] = data[key];
            } else if (key == '52WeekLow') {
              obj['s52WeekLow'] = data[key];
            } else if (key == '50DayMovingAverage') {
              obj['s50DayMovingAverage'] = data[key];
            } else if (key == '200DayMovingAverage') {
              obj['s200DayMovingAverage'] = data[key];
              return;
            } else {
              const sKey = key?.charAt(0).toString().toLowerCase() + key?.substring(1);
              obj[sKey] = data[key];
            }

            return obj;
          }, {});

        resolve({ data: filteredData, status : 200 });
      }
    });

  });
}

module.exports = { getSearchAlphavantage };
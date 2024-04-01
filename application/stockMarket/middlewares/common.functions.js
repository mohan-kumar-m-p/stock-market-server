
const apiKey = process.env.ALPHA_KEY;

function getSearchAlphavantage (symbol) {
  return new Promise((resolve, reject) => {

    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
    const options = {
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      }
    };
    fetch(url, options)
      .then((res)=> res.json())
      .then((res)=>{
        const data = Object.assign({}, res);
        console.log('data -- ', data);
        if ( Object.keys(data)?.length <= 0 ) {
          resolve({ status: 401 });
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
              } else {
                const sKey = key?.charAt(0).toString().toLowerCase() + key?.substring(1);
                obj[sKey] = data[key];
              }

              return obj;
            }, {});
          console.log('filteredData -- ', filteredData);
          resolve({ data: filteredData, status : 200 });
        }
      }).catch((err) => {
        reject(new Error(err.message));
      });

  });
}

module.exports = { getSearchAlphavantage };
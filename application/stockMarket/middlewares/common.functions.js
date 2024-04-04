
const apiKey = process.env.ALPHA_KEY;

function getSearchAlphavantage (symbol) {
  return new Promise((resolve, reject) => {

    const url = `https://wwww.aalphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
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
        if ( !data || Object.keys(data)?.length <= 0 ) {
          resolve({ data: {}, status: 401 });
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
          resolve({ data: filteredData || {}, status : 200 });
        }
      }).catch((err) => {
        resolve({ data: {}, status: 401 });
      });

  });
}

function getOHLCVAlphavantage (symbol, companyId) {
  return new Promise((resolve, reject) => {

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

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
        if ( !data || Object.keys(data)?.length <= 0 ) {
          resolve({ data: {}, status: 401 });
        } else {

          const { 'Meta Data': metaData, 'Time Series (5min)': timeSeries } = data;

          if (!metaData || !timeSeries){
            resolve({ data: {}, status: 401 });
          }

          const filteredData = Object.entries(timeSeries).map(([date, { '1. open': open, '2. high': high, '3. low': low, '4. close': close, '5. volume': volume }]) => ({
            date: new Date(date),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseInt(volume, 10),
            companyId: companyId,
            Symbol: metaData['2. Symbol'],
            createdBy:'EXMPLEID4343434'
          }));

          console.log('filteredData -- ', filteredData);
          resolve({ data: filteredData || {}, status : 200 });
        }
      }).catch((err) => {
        resolve({ data: {}, status: 401 });
      });

  });
}

module.exports = { getSearchAlphavantage, getOHLCVAlphavantage };
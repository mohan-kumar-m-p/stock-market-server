const { getOHLCVAlphavantage } = require('../../../middlewares/common.functions');
const { CRUD } = require('../../../models/crud.model');

const create = async (req, res, historicalDataModel, stockCompanyModel) => {
  const userId = req?.user?.id ?? 'System';

  const { symbol, companyId } = req.body;

  //before creating OHLCV data of the company check whether the company symbol exists.
  const exists = await CRUD.find(stockCompanyModel, { filter: { symbol: symbol } });

  //if symbol does not exits then can't get the OHLCV data company name
  if (exists?.length <= 0) {
    return res.status(401).json({
      success: false,
      message: 'Company symbol not found'
    });
  }
  let year = exists[0]?.lastRefreshed?.substring(0, 4);
  let m = exists[0]?.lastRefreshed?.substring(5);
  let month = '';
  if (!isNaN(m) && parseInt(m) >= 12){
    year = year?.substring(0, 3) + (parseInt(year?.substring(3, 4)) + 1);
    month = year + '-' + 1;
  } else {
    month = year + '-' + (parseInt(m) + 1);
  }
  // get the OHLCV data from free API.
  const ohlcvData = await getOHLCVAlphavantage(symbol, month, companyId, userId);

  if (ohlcvData?.status === 401 || !ohlcvData || !Array.isArray(ohlcvData?.data) || ohlcvData?.data?.length <= 0 ) {
    return res.status(401).json({
      success: false,
      message: 'OHLCV data is upto date.'
    });
  }

  const resBody = ohlcvData?.data;

  //Create the stock market OHLCV document
  const result = await CRUD.insertMany(historicalDataModel, resBody);

  res.status(200).send({
    success: true,
    result: { data: result },
    message: 'Stock market OHLCV data created successfully'
  });

  await CRUD.updateOne (stockCompanyModel, { symbol: symbol }, { lastRefreshed:ohlcvData?.lastRefreshed });

  return;
};

module.exports = create;

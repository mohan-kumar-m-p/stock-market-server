const { getSearchAlphavantage, getOHLCVAlphavantage } = require('../../../middlewares/common.functions');
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
  // get the OHLCV data from free API.
  const ohlcvData = await getOHLCVAlphavantage(symbol, companyId);

  if (!ohlcvData || !ohlcvData?.data || Object.keys(ohlcvData?.data)?.length <= 0 || ohlcvData?.status === 401) {
    return res.status(401).json({
      success: false,
      message: 'OHLCV data is upto date.'
    });
  }

  const resBody = Object.assign({}, ohlcvData?.data);
  resBody.createdBy = userId;
  console.log('ohlcvData --', ohlcvData);
  console.log('resBody --', resBody);
  //Create the stock market OHLCV document
  const result = await CRUD.insertMany(historicalDataModel, resBody);

  res.status(200).send({
    success: true,
    result: { data: result },
    message: 'Stock market OHLCV data created successfully'
  });

  return;
};

module.exports = create;

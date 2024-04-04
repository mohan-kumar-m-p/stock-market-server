const create = require('./create');
const getOne = require('./getOne');
const list = require('./list');

//Gathering stock market OHLCV controllers
const createStockOHLCVCtrl = (historicalDataModel, stockCompanyModel) => {
  const stockOHLCVCtrl = {};

  stockOHLCVCtrl.create = (req, res) => create(req, res, historicalDataModel, stockCompanyModel);
  stockOHLCVCtrl.list = (req, res) => list(req, res, historicalDataModel);
  stockOHLCVCtrl.getOne = (req, res) => getOne(req, res, historicalDataModel);

  return stockOHLCVCtrl;
};

module.exports = createStockOHLCVCtrl;

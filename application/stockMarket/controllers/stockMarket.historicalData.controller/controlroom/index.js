const create = require('./create');
const getOne = require('./getOne');
const list = require('./list');

//Gathering stock market OHLCV controllers
const createStockOHLCVCtrl = (historicalDataModel, stockCompanyModel) => {
  const stockOHLCVCtrl = {};

  stockOHLCVCtrl.create = (req, res) => create(req, res, historicalDataModel, stockCompanyModel);
  stockOHLCVCtrl.list = (req, res) => list(req, res, historicalDataModel, stockCompanyModel);
  stockOHLCVCtrl.getOne = (req, res) => getOne(req, res, historicalDataModel, stockCompanyModel);

  return stockOHLCVCtrl;
};

module.exports = createStockOHLCVCtrl;

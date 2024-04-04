
const { stockCompanyModel } = require('../../models/helpers/stockMarket.company.definition');
const { historicalDataModel } = require('../../models/helpers/stockMarket.historicalData.definition');
const createStockOHLCVCtrl = require('./controlroom/index');

// creating the stock market OHLCV controller.
const stockOHLCVCtrl = createStockOHLCVCtrl(historicalDataModel, stockCompanyModel );

module.exports = stockOHLCVCtrl;
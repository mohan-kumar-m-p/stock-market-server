const { stockCompanyModel } = require('../../models/helpers/stockMarket.company.definition');
const createStockCompanyCtrl = require('./controlroom/index');

// creating the stock market company controller.
const stockCompanyCtrl = createStockCompanyCtrl(stockCompanyModel);

module.exports = stockCompanyCtrl;
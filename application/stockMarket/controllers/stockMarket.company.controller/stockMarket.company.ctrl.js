const { stockCompanyModel } = require('../../models/helpers/stockMarket.company.definition');
const createStockCompanyCtrl = require('./controlroom');

// creating the stock market company controller.
const stockCompanyCtrl = createStockCompanyCtrl(stockCompanyModel);

module.exports = stockCompanyCtrl;
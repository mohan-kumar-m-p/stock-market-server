const create = require('./create');

//Gathering stock market company controllers
const createStockCompanyCtrl = (stockCompanyModel) => {
  const stockCompanyCtrl = {};

  stockCompanyCtrl.create = (req, res) => create(req, res, stockCompanyModel);

  return stockCompanyCtrl;
};

module.exports = createStockCompanyCtrl;

const create = require('./create');
const getOne = require('./getOne');
const list = require('./list');

//Gathering stock market company controllers
const createStockCompanyCtrl = (stockCompanyModel) => {
  const stockCompanyCtrl = {};

  stockCompanyCtrl.create = (req, res) => create(req, res, stockCompanyModel);
  stockCompanyCtrl.list = (req, res) => list(req, res, stockCompanyModel);
  stockCompanyCtrl.getOne = (req, res) => getOne(req, res, stockCompanyModel);

  return stockCompanyCtrl;
};

module.exports = createStockCompanyCtrl;

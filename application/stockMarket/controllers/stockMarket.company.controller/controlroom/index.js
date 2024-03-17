const create = require("./create");

//Gathering stock market company controllers
const createStockCompanyCtrl = (stockCompanyModel) => {
  const stockCompanyCtrl = {};

  stockCompanyCtrl.create = (req, res) => create(stockCompanyModel, req, res);

  return stockCompanyCtrl;
};

module.exports = createStockCompanyCtrl;

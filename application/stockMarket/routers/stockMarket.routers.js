const express = require('express');
// const { hasPermission } = require('../controllers/middlewares/permission.js');
const stockCompanyCtrl = require('../controllers/stockMarket.company.controller/stockMarket.company.ctrl.js');
const { catchErrors } = require('../../../handlers/errorHandlers.js');

const companyRouter = express.Router();

//route to create company
// companyRouter
//   .route('/stockmarket/company/create')
//   .post(hasPermission('admin'), catchErrors(stockCompanyCtrl.create));

companyRouter
  .route('/stockmarket/company/create')
  .post( catchErrors(stockCompanyCtrl.create));

//route to get company list
companyRouter
  .route('/stockmarket/company/list')
  .get( catchErrors(stockCompanyCtrl.list));

//route to get company list
companyRouter
  .route('/stockmarket/company/view/:id')
  .get( catchErrors(stockCompanyCtrl.getOne));

module.exports = companyRouter;

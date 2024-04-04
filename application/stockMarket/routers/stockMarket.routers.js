const express = require('express');
// const { hasPermission } = require('../controllers/middlewares/permission.js');
const stockCompanyCtrl = require('../controllers/stockMarket.company.controller/stockMarket.company.ctrl.js');
const { catchErrors } = require('../../../handlers/errorHandlers.js');
const stockOHLCVCtrl = require('../controllers/stockMarket.historicalData.controller/stockMarket.historicalData.ctrl.js');

const router = express.Router();

//route to create company
// companyRouter
//   .route('/stockmarket/company/create')
//   .post(hasPermission('admin'), catchErrors(stockCompanyCtrl.create));

router
  .route('/stockmarket/company/create')
  .post( catchErrors(stockCompanyCtrl.create));

//route to get company list
router
  .route('/stockmarket/company/list')
  .get( catchErrors(stockCompanyCtrl.list));

//route to get company list
router
  .route('/stockmarket/company/view/:id')
  .get( catchErrors(stockCompanyCtrl.getOne));

//---------------------- OHLCV routes ---------------------------//
//route to create OHLCV data
router
  .route('/stockmarket/ohlcv/create')
  .post( catchErrors(stockOHLCVCtrl.create));

//route to get ohlcv list
router
  .route('/stockmarket/ohlcv/list')
  .get( catchErrors(stockOHLCVCtrl.list));

//route to get ohlcv list
router
  .route('/stockmarket/ohlcv/view/:id')
  .get( catchErrors(stockOHLCVCtrl.getOne));

module.exports = router;

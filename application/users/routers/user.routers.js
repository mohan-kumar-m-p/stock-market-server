const express = require('express');
const { hasPermission } = require('../controllers/middlewares/permission.js');
const userController = require('../controllers/user.controller/user.controller.js');
const { catchErrors } = require('../../../handlers/errorHandlers.js');

const userRouter = express.Router();

//route to create users
userRouter
  .route('/admin/create')
  .post( catchErrors(userController.create));

module.exports = userRouter;

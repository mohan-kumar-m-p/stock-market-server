const express = require('express');
const { catchErrors } = require('../../../handlers/errorHandlers');
const authController = require('../controllers/auth.controller/auth.controller');

const authRouter = express.Router();

// route to handle login
authRouter.route('/admin/login').post(catchErrors(authController.login));

module.exports = authRouter;

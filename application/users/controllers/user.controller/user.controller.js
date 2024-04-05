const { userModel } = require('../../models/helpers/user.crud.definition.js');
const createUserController = require('./controlroom/index.js');

const userController = createUserController(userModel);

module.exports = userController;

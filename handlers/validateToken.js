const jwt = require('jsonwebtoken');
const { userModel } = require('../application/users/models/helpers/user.crud.definition');

//It is to validate the token, whether the users contain valid token or not
const isValidAuthToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization.split(' ');
    const token = authHeader[1];

    if (!token || authHeader[0] !== 'JWT')
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication token, authorization denied.',
        jwtExpired: true
      });

    const verified = jwt.verify(JSON.parse(token), process.env.JWT_SECRET);
    console.log('verified', verified);
    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied.',
        jwtExpired: true
      });

    const user = await userModel.findOne({
      _id: verified.id,
      isDeleted: false
    });

    if (!user)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'User doens\'t Exist, authorization denied.',
        jwtExpired: true
      });

    req.user = user;
    next();

  } catch (error) {
    return res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
      controller: 'isValidAuthToken'
    });
  }
};

module.exports = isValidAuthToken;

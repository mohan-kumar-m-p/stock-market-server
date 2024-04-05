const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { CRUD } = require('../../../models/crud.model');

// Joi schema validation
const objectSchema = Joi.object({
  email: Joi.string()
    .required('Email required'),
  password: Joi.string().required()
});

const login = async (userModel, req, res) => {
  const { username: email, password } = req.body;

  const { error, value } = objectSchema.validate({ email, password });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message
    });
  }

  const user = await CRUD.findOne(userModel, {
    email: email,
    isDeleted: false
  });

  if (!user)
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No account with this email has been registered.'
    });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(403).json({
      success: false,
      result: null,
      message: 'Invalid credentials.'
    });

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name
    },
    process.env.JWT_SECRET,
    {
      expiresIn: req.body.remember ? '365d' : '6h',
      algorithm: 'HS256'
    }
  );

  await CRUD.findOneAndUpdate(
    userModel,
    { _id: user._id },
    { $push: { loggedSessions: token }, $set: { token: token } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    result: {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
      token: token
    },
    message: 'Successfully login user'
  });
};

module.exports = login;

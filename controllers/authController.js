// requiring th Jason Web token (npm i jsonwebtoken)
const jwt = require('jsonwebtoken');

// requiring the userModal from the modals folder
//const { create } = require('./../models/userModel');
const User = require('./../models/userModel');

// requirung the catching errors catchAsync function from utilities folder
const catchAsync = require('./../utils/catchAsync');

// requirung the Global error handling middleware, AppError Class which is in utils folder
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //payload { id: newUser._id }        //  the secret process.env.JWT_SECRET (the secret can be anything you want. it doesn't matter.)
  const token = signToken(newUser._id);

  // 201 for created
  res.status(201).json({
    status: 'success',
    token,
    data: {
      // data Property which is again called an envelope, container of the data itself
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if E-mail and Password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); //+ cuz by default not selected

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // 401 means unauthorized
  }

  // 3) If everything is ok, send JWT( Json Web Token) to the client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

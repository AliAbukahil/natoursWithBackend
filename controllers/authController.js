// requirung the Node built-in promisify function
const { promisify } = require('util');

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

// a new middleware function
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// another middleware function to restrict routes, for Example, for deleting tours administrator privileges
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles is an array ["admin", "lead-guide"]. role="user"
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      ); // 403 means forbidden
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404)); // 404 means not found
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
});

exports.resetPassword = (req, res, next) => {};

// requiring th Jason Web token (npm i jsonwebtoken)
const jwt = require('jsonwebtoken');
// requiring the userModal from the modals folder
//const { create } = require('./../models/userModel');
const User = require('./../models/userModel');

// requirung the catching errors catchAsync function from utilities folder
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //payload        //  the secret
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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

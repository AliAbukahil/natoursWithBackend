// requiring the userModal from the modals folder
//const { create } = require('./../models/userModel');
const User = require('./../models/userModel');

// requirung the catching errors catchAsync function from utilities folder
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  // 201 for created
  res.status(201).json({
    status: 'success',
    data: {
      // data Property which is again called an envelope, container of the data itself
      user: newUser,
    },
  });
});

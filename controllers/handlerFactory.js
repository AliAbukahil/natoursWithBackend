const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// delete Http method
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    // status (204) means no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// the goel here is basically to create a function which will then return a function that looks like this one above
// delete Http method
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour with that ID', 404));
//   }

//   // status (204) means no content
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

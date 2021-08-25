// requiring the tourModals from the modals folder
//const { create } = require('./../models/tourModel');
const Tour = require('./../models/tourModel');
// this is where we read the tours from the json file
// note => this is only for test purposes
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// a middleware function
// in a param middleware function we actually get access to a fourth argument example : val
// this is how middleware works
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// ) Route Handlers
// Get Http method
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    // this find() method will return an array of all the Documents and will also very nicely convert them into javaScript objects

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};
// Get Http method
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //a shorthand findById for having to write this ==> Tour.fondOne({ _id: req.params.id})
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (ERROR) {
    res.status(404).json({
      status: 'fail',
      message: ERROR,
    });
  }
};
// Post Http method
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
//patch Http method
exports.updateTour = async (req, res) => {
  try {
    // querying for the document that we want to update
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
// delete Http method
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    // status (204) means no content
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

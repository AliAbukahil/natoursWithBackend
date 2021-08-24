// requiring the tourModals from the modals folder
const { create } = require('./../models/tourModel');
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

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //a shorthand Tour.fondOne({ _id: req.params.id})
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

exports.createTour = async (req, res) => {
  try {
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
      message: 'Invalid data sent',
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...',
    },
  });
};

exports.deleteTour = (req, res) => {
  // status (204) means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

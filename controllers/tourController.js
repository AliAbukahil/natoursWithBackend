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
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    // optional when sending multiple responses, to include a field called results to show how many results are there, only makes sense whenever we're sending an array
    // results: tours.length,
    // requestedAt: req.requestTime,
    //this is the envelope for our data
    // in ES6 we don't have to specify the KEY and the VALUE if they are both the same name like this for Example data: { tours: tours },
    // data: { tours },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  // const tour = tours.find((element) => element.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
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

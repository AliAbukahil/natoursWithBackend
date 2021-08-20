const fs = require('fs');
const express = require('express');
// requiring morgan Middleware
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARE

//  including middleware
// middleware is basically just a function that can modify the incoming request data
// it is called middleware because it stands between, so in the middle of the request and the response
app.use(morgan('dev'));
app.use(express.json());

// Middleware Function next
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});
// Another Middleware Function next
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) Route Handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    // optional when sending multiple responses, to include a field called results to show how many results are there, only makes sense whenever we're sending an array
    results: tours.length,
    requestedAt: req.requestTime,
    //this is the envelope for our data
    // in ES6 we don't have to specify the KEY and the VALUE if they are both the same name like this for Example data: { tours: tours },
    data: { tours },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((element) => element.id === id);

  // if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // status (204) means no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// the route handler
// get http method to get a new tour
// app.get('/api/v1/tours', getAllTours);
//app.get('/api/v1/tours/:id', getTour);
// post http method to create a new tour
// the req is what hold all the data
//app.post('/api/v1/tours', createTour);
// to update data we have two http methods
// we have (Put) and we (Patch)
// And with Put, we expect that our application receives the entire updated object
// And with Patch, we only expect the properties that should be updated on the object
//app.patch('/api/v1/tours/:id', updateTour);
// Delete http method
//app.delete('/api/v1/tours/:id', deleteTour);

// 3) Routes

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/v1/tours', tourRouter);
app.use('api/v1/user', userRouter);

// 4) Start SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

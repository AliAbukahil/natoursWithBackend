const fs = require('fs');
const express = require('express');
const { fail } = require('assert');

const app = express();

//  including middleware
// middleware is basically just a function that can modify the incoming request data
// it is called middleware because it stands between, so in the middle of the request and the response
app.use(express.json());
//////////////////////////////////////////

// // Defining Route, all we do is app then the http method (get) we want to respond to
// // get is http method
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// // post is also http method
// // this is how we send different responses
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// the route handler
// get method to get a new tour
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    // optional when sending multiple responses, to include a field called results to show how many results are there, only makes sense whenever we're sending an array
    results: tours.length,
    //this is the envelope for our data
    // in ES6 we don't have to specify the KEY and the VALUE if they are both the same name like this for Example data: { tours: tours },
    data: { tours },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

// post method to create a new tour
// the req is what hold all the data
app.post('/api/v1/tours', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

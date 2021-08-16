const fs = require('fs');
const express = require('express');

const app = express();

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

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

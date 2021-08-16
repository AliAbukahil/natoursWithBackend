const express = require('express');

const app = express();

// Defining Route, all we do is app then the http method (get) we want to respond to
// get is http method
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

// post is also http method
// this is how we send different responses
app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const express = require('express');
// requiring morgan Middleware
const morgan = require('morgan');
// requiring tourRoutes and userRoutes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

// 3) Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

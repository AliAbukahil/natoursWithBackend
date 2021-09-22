const express = require('express');
// requiring morgan Middleware
const morgan = require('morgan');
// requiring express rate limit package
const rateLimit = require('express-rate-limit');
// requiring AppError
const AppError = require('./utils/appError');
// requiring errorController from controllers folder
const globalErrorHandler = require('./controllers/errorController');
// requiring tourRoutes and userRoutes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) GlOBAL MIDDLEWARES
//  including middleware
// middleware is basically just a function that can modify the incoming request data
// it is called middleware because it stands between, so in the middle of the request and the response
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // this will allow 100 requests from the same IP in one hour
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Middleware
app.use(express.json());

// a build in Express Middleware if we wanna serve static files like images and html pages
app.use(express.static(`${__dirname}/public`));

// Middleware Function next
// Just use this Middleware here in order to demonstrate
// the concept of Middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

// Another Middleware Function next
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
  // console.log(req.headers);
  next();
});

// 3) Routes

// tours
app.use('/api/v1/tours', tourRouter);
// users
app.use('/api/v1/users', userRouter);

// this route should be the last part after all our other routes
// example 127.0.0.1:3000/api/tours/monkey :`)
// in Express we can use app.all for all the HTTP method
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// an error handling middleware function
app.use(globalErrorHandler);

module.exports = app;

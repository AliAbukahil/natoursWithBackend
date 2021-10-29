// requiring Path node core module
const path = require('path');
const express = require('express');
// requiring morgan Middleware
const morgan = require('morgan');
// requiring express rate limit package
const rateLimit = require('express-rate-limit');
// requiring helmet package
const helmet = require('helmet');
// requiring the sanitizer
const mongoSanitize = require('express-mongo-sanitize');
// requiring the xss Cleaner
const xss = require('xss-clean');
// requiring the hpp HTTP Parameter pollution
const hpp = require('hpp');
// requiring Cookie parser
const cookieParser = require('cookie-parser');
// requiring AppError
const AppError = require('./utils/appError');
// requiring errorController from controllers folder
const globalErrorHandler = require('./controllers/errorController');
// requiring tourRoutes and userRoutes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// mounting the viewRoutes to the app
const viewRouter = require('./routes/viewRoutes');

const app = express();
// setting up the pug engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GlOBAL MIDDLEWARES
//  Serving static files like images and html pages
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// middleware is basically just a function that can modify the incoming request data
// it is called middleware because it stands between, so in the middle of the request and the response

// Set Security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // this will allow 100 requests from the same IP in one hour
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser()); // this parses the data from cookies

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // it removes the $ sign "email": {"$gt": ""}

// Data sanitization against XSS
app.use(xss());

// prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Middleware Function next
// Just use this Middleware here in order to demonstrate
// the concept of Middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString().slice(0, 16).replace('T', ' ');
  console.log(req.cookies);
  next();
});

// 3) Routes
// view Router
app.use('/', viewRouter);
// tours
app.use('/api/v1/tours', tourRouter);
// users
app.use('/api/v1/users', userRouter);
// reviews
app.use('/api/v1/reviews', reviewRouter);

// this route should be the last part after all our other routes
// example 127.0.0.1:3000/api/tours/monkey :`)
// in Express we can use app.all for all the HTTP method
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// an error handling middleware function
app.use(globalErrorHandler);

module.exports = app;

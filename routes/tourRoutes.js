const express = require('express');
// reqiuring the tour controller
const tourController = require('../controllers/tourController');
// reqiuring the authController
const authController = require('../controllers/authController');
// requiring the review Router
const reviewRouter = require('../routes/reviewRoutes');

const router = express.Router();

// the param Middleware
// in a param middleware function we actually get access to a fourth argument example : val
// router.param('id', tourController.checkID);

// This is called mounting a router
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap') // aliasTopTours is a middleware function which will manipulate the query object that's coming in
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getToursStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
//  /tours-within/:distance/center/:latlng/unit/:unit
//  /tours-within/233/center/34.128117, -118.156029/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// When we have one thing to export we use module.exports
module.exports = router;

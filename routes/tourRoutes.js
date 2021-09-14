const express = require('express');
// reqiuring the tour controller
const tourController = require('../controllers/tourController');
const router = express.Router();
// reqiuring the authController
const authController = require('../controllers/authController');

// the param Middleware
// in a param middleware function we actually get access to a fourth argument example : val
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap') // aliasTopTours is a middleware function which will manipulate the query object that's coming in
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getToursStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// When we have one thing to export we use module.exports
module.exports = router;

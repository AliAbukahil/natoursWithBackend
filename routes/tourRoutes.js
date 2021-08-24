const express = require('express');
// reqiuring the tour controller
const tourController = require('../controllers/tourController');
const router = express.Router();

// the param Middleware
// in a param middleware function we actually get access to a fourth argument example : val
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// When we have one thing to export we module.exports
module.exports = router;

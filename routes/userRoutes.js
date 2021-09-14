const express = require('express');
// requiring the user controller
const userController = require('../controllers/userController');
// requiring the auth controller
const authController = require('../controllers/authController');

const router = express.Router();

// a route for signup
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// routes in REST format
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// routes in REST format
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// When we have one thing to export we module.exports
module.exports = router;

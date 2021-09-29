const express = require('express');
// requiring the user controller
const userController = require('./../controllers/userController');
// requiring the auth controller
const authController = require('./../controllers/authController');

const router = express.Router();

// a route for signup
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword); // only receive the email address
router.patch('/resetPassword/:token', authController.resetPassword); // will receive the token as well as the new password

// this here is a nice little trick in order to protect all of the routes at the same time
// typically by using a middleware that comes before all these other routes.
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

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

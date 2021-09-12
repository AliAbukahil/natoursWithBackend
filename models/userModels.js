// requiring mongoose package
const mongoose = require('mongoose');

// requiring Validator to validate Email
const validator = require('validator');

// Building up the user schema
// name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    //to check if the email valid and doesn't have any weird characters
    validate: [validator, isEmail, 'please provide a valid Email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    // a password rule of 8 charachters as min
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
});

// creating a model out the Schema above
const User = mongoose.model('User, userSchema');

module.exports = User;

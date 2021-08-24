// requiring mongoose package
const mongoose = require('mongoose');
// Building up a schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
// creating a model out the Schema above
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// requiring mongoose package
const mongoose = require('mongoose');
// requiring dotenv
const dotenv = require('dotenv');

//Environment Variables
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// calling the connect method on mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

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

// requiring the app file
const app = require('./app');

//  Start SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

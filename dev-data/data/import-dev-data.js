// creating a script to load the data from JSON file to into the Mongo Data base. and this script is completely independent of the rest of our express application and so we run this completely separately from the comment line just to import everything one.
// requiring fs file system module
const fs = require('fs');
// requiring mongoose package
const mongoose = require('mongoose');
// requiring dotenv
const dotenv = require('dotenv');
// reqquiring the Tour model
const Tour = require('./../../models/tourModel');

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

// after all this above Now we start READING the JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// now we write the actual function that is going to import the data into the MongoDB data base
// IMPORT DATA INTO DB
const importData = async () => {
  try {
    // So the create method here can also accept an array of objects not only objects and in that case, it will then simply create a new document for each of the objects in the array
    await Tour.create(tours);
    console.log('Data successfully Imported!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// A Function to DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    // when using deleteMany Method and pass nothing in the parameters and that would then delete all of the documents in a certain collection
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);

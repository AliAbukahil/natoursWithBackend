// requiring mongoose package
const mongoose = require('mongoose');
// requiring slugify package
const slugify = require('slugify');
// requiring Validator
// const validator = require('validator');
// Building up a schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // this required field is a built in data validator
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'], // validator only available on strings
      minlength: [10, 'A tour name must have more or equal then 10 characters'], // validator only available on strings
      // validate: [validator.isAlpha, 'A Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        //this is very handy validator, that is automatically available on all strings ONLY
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], // validator not only for numbers also with dates
      max: [5, 'Rating must be below 5.0'], // validator not only for numbers also with dates
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // a custom Validator
      validate: {
        validator: function (val) {
          // not an arrow function but a real function, because we have to access the (this) variable which cannot be accessed
          // Not gonna work on update // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the reqular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    // these startDate are basically different dates at which a tour starts. For example, we can have a tour starting in December this year, and in February, the next year, and then another one in the summer and so different dates for the same tour
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Properties
// why the reqular function here? because an arrow function does not get its own (this) keyword and in we need the (this) keyword
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
  // ?? /7 => this is how we calculate the duration in weeks
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT Mongoose MIDDLEWARE: runs before .save() and .create() ONLY on those two Not for update()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// this one here is responsible for performing the embedding basically
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
//tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt',
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} millieseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // $ne => not equal
  next();
});

// creating a model out the Schema above
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

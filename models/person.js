/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log(`can't connect to MongoDB: ${err}`));

const numberValidator = (number) => /^([0-9]{2}-|[0-9]{3}-)[0-9]*$/i.test(number);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: numberValidator,
      message: 'Invalid phone number',
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);

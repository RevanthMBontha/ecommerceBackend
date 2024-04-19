import mongoose from 'mongoose';

const addressSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [4, 'A name should have at least 4 characters'],
    required: [true, 'An address should have a name'],
  },
  phoneNumber: {
    type: Number,
    required: [true, 'An address should have a number'],
  },
  houseNum: {
    type: String,
    required: [true, 'An address should have a house number'],
  },
  area: {
    type: String,
    required: [true, 'An address should have an area'],
  },
  landmark: {
    type: String,
  },
  city: {
    type: String,
    required: [true, 'An address should have a city'],
  },
  state: {
    type: String,
    required: [true, 'An address should have a state'],
  },
  country: {
    type: String,
    required: [true, 'An address should have a country'],
  },
  pinCode: {
    type: String,
    required: [true, 'An address should have a pin code'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An address must have a user linked to it'],
  },
});

const Address = mongoose.model('Address', addressSchema);

export default Address;

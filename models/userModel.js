import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Validator from 'validatorjs';

import AppError from '../utils/appError.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'first name cannot be empty!'],
      validate: {
        validator: (value) => {
          const regex = /^[a-zA-Z]+$/;
          return regex.test(value);
        },
        message: 'first name can only contain alphabetical characters',
      },
    },
    lastName: {
      type: String,
      required: [true, 'last name cannot be empty!'],
      validate: {
        validator: (value) => {
          const regex = /^[a-zA-Z]+$/;
          return regex.test(value);
        },
        message: 'last name can only contain alphabetical characters',
      },
    },
    email: {
      type: String,
      required: [true, 'email cannot be empty!'],
      unique: true,
      validate: {
        validator: (value) => {
          const validation = new Validator(
            { email: value },
            { email: 'required|email' }
          );
          return validation.passes();
        },
        message: 'Email is not valid',
      },
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
      validate: {
        validator: (value) => {
          const regex = /^(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).+$/;
          return regex.test(value);
        },
        message:
          'Password needs to contain at least one number and one special character',
      },
    },
    passwordConfirm: {
      type: String,
      required: [true, 'User must have a password'],
      validate: {
        validator: (value) => {
          const regex = /^(?=.*[0-9])(?=.*[^a-zA-Z0-9\s]).+$/;
          return regex.test(value);
        },
        message:
          'Password needs to contain at least one number and one special character',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    orders: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Order',
      },
    ],
    savedAddresses: [{ type: mongoose.Schema.ObjectId, ref: 'Address' }],
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Change all necessary items to lowercase
userSchema.pre('save', function (next) {
  this.firstName = this.firstName.toLowerCase();
  this.lastName = this.firstName.toLowerCase();
  this.email = this.email.toLowerCase();
  next();
});

userSchema.pre('save', async function (next) {
  // if password and passwordConfirm do not match then throw error
  if (this.password !== this.passwordConfirm) {
    next(new AppError('Passwords do not match', 400));
  }

  console.log('About to access bcrypt');
  this.password = await bcrypt.hash(this.password, 10);

  // Set the passwordConfirm to undefined to prevent it from being added to the database
  this.passwordConfirm = undefined;

  console.log(this.password);
  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.hasChangedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimeStamp;
  }
  // False means not changed!
  return false;
};

const User = mongoose.model('User', userSchema);

export default User;

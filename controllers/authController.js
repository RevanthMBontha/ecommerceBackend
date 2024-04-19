import { catchAsync } from './../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { promisify } from 'util';

import User from '../models/userModel.js';
import AppError from '../utils/appError.js';

// Sign Token
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Sign Up
export const signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, password, passwordConfirm, role } =
    req.body;

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    role,
  });

  res.status(200).json({
    status: 'success',
    data: {
      id: newUser._id,
    },
  });
});

// Login
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  let thisUser = await User.find({ email: email });
  thisUser = thisUser[0];

  const test = await thisUser.checkPassword(password, thisUser.password);

  if (!test) {
    return next(new AppError('Password is wrong', 400));
  }

  const token = signToken(thisUser._id);

  res.status(200).json({
    status: 'success',
    token: token,
    name: thisUser.firstName,
    id: thisUser._id,
  });
});

// Protected Routes
export const protect = catchAsync(async (req, res, next) => {
  // Protect routes using this
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    next(
      new AppError('User is not authenticated! Please login to access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('This user does not exist anymore!', 401));
  }

  req.user = freshUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // Restrict to admin roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const restrictToAdmin = catchAsync(async (req, res, next) => {
  let thisUser = await User.find({ email: req.body.email });
  thisUser = thisUser[0];
  if (thisUser.role !== 'admin') {
    next(new AppError('You do not have permission to log in'));
  }
  next();
});

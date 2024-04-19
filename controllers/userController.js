import User from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getUser = catchAsync(async (req, res, next) => {
  const thisUserID = req.params.id;
  const thisUser = await User.findById(thisUserID).select('-password');
  if (!thisUser) return next(new AppError('User not found', 404));
  console.log(thisUser);

  res.status(200).json({
    status: 'success',
    data: {
      user: thisUser,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const thisUserID = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(thisUserID);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

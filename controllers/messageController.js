import Message from '../models/messageModel.js';
import { catchAsync } from './../utils/catchAsync.js';
import AppError from './../utils/appError.js';

export const getMessages = catchAsync(async (req, res) => {
  const messages = await Message.find({});

  // Sort the messages in the descending order such that the latest message is displayed on top
  messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      messages,
    },
  });
});

export const sendMessage = catchAsync(async (req, res, next) => {
  const { name, email, phoneNumber, messageBody } = req.body;

  if (!name || !email || !phoneNumber || !messageBody) {
    next(new AppError('Some required fields are missing', 400));
  }

  const newMessage = {
    name: name,
    email: email,
    phoneNumber: phoneNumber,
    messageBody: messageBody,
  };

  await Message.create(newMessage);

  res.status(200).json({
    status: 'success',
    data: {
      message: newMessage,
    },
  });
});

export const getMessage = catchAsync(async (req, res) => {
  const id = req.params.id;
  const message = await Message.findById(id);

  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});

export const updateMessage = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const message = await Message.findById(id);
  if (!message) next(new AppError('No such message', 400));

  message.isRead = req.body.isRead;

  const updatedMessage = await message.save();

  res.status(200).json({
    status: 'success',
    data: {
      message: updatedMessage,
    },
  });
});

export const deleteMessage = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedMessage = await Message.findByIdAndDelete(id);

  if (!deletedMessage) next(new AppError('No such message found'));

  res.status(200).json({
    status: 'success',
    message: 'Message deleted successfully',
  });
});

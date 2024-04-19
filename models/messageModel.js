import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A message must have the user's name"],
    },
    email: {
      type: String,
      required: [true, "A message must have the user's email"],
    },
    phoneNumber: {
      type: String,
      required: [true, "A message must have the user's phone number"],
      maxlength: [10, 'A number cannot be longer than 10 digits'],
    },
    messageBody: {
      type: String,
      required: [true, 'A message must have a message body'],
    },
    isRead: {
      type: Boolean,
      required: [true, 'A message should either be read or unread'],
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;

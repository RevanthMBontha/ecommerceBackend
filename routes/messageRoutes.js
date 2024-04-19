import { Router } from 'express';
import {
  deleteMessage,
  getMessage,
  getMessages,
  sendMessage,
  updateMessage,
} from '../controllers/messageController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = Router();

router
  .route('/')
  .get(protect, restrictTo('admin'), getMessages)
  .post(sendMessage);
router
  .route('/:id')
  .get(protect, restrictTo('admin'), getMessage)
  .patch(protect, restrictTo('admin'), updateMessage)
  .delete(protect, restrictTo('admin'), deleteMessage);

export default router;

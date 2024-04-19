import { Router } from 'express';

import {
  login,
  protect,
  restrictTo,
  restrictToAdmin,
  signup,
} from '../controllers/authController.js';
import { getUser } from '../controllers/userController.js';

const router = Router();

router.post('/login', login);
router.post('/signup', signup);

router.route('/login/admin').post(restrictToAdmin, login);

router.route('/:id').get(getUser);

export default router;

import { Router } from 'express';
import { protect } from '../controllers/authController.js';
import {
  capOrder,
  getAllOrdersByUser,
  getSpecificOrder,
  newOrder,
} from '../controllers/orderController.js';

const router = Router();

router
  .route('/orders')
  .get(protect, getAllOrdersByUser)
  .post(protect, newOrder);
router.route('/orders/:orderID/capture').post(capOrder);

router.route('/orders/:id').get(protect, getSpecificOrder);

export default router;

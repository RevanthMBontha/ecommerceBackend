import { Router } from 'express';
import {
  getSavedAddressesByUser,
  addSavedAddressToUser,
  deleteAddressFromUser,
} from '../controllers/addressController.js';
import { protect } from '../controllers/authController.js';

const router = Router();

router
  .route('/addresses')
  .get(protect, getSavedAddressesByUser)
  .post(protect, addSavedAddressToUser);

router.route('/addresses/:id').delete(protect, deleteAddressFromUser);

export default router;

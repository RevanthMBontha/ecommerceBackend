import { Router } from 'express';
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getMenProducts,
  getWomenProducts,
  getUnisexProducts,
  getSearchedProducts,
} from '../controllers/productController.js';

import { protect, restrictTo } from '../controllers/authController.js';

const router = Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, restrictTo('admin'), addProduct);

router.route('/men').get(getMenProducts);

router.route('/women').get(getWomenProducts);

router.route('/unisex').get(getUnisexProducts);

router.route('/featured').get(getFeaturedProducts);

router.route('/search').get(getSearchedProducts);

router
  .route('/:id')
  .get(getProduct)
  .patch(protect, restrictTo('admin'), updateProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

export default router;

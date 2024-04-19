import Product from '../models/productModel.js';
import { catchAsync } from './../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const getProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

export const getSearchedProducts = catchAsync(async (req, res) => {
  const value = req.query.value;
  const searchTerms = value.split(' ');
  console.log(searchTerms);

  let searchQuery = {};

  if (
    searchTerms.length > 0 &&
    !(searchTerms.length === 1 && searchTerms[0] === '')
  ) {
    const searchConditions = searchTerms.map((term) => ({
      $or: [
        { name: { $regex: term, $options: 'i' } }, // Case-insensitive match
        { category: { $regex: term, $options: 'i' } }, // Case-insensitive match
        { quote: { $regex: term, $options: 'i' } }, // Case-insensitive match
        { keyPoints: { $regex: term, $options: 'i' } }, // Case-insensitive match
      ],
    }));

    searchQuery = { $or: searchConditions };
  } else {
    searchQuery = {
      _id: null,
    };
  }

  const products = await Product.find(searchQuery);

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

export const getMenProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  const menProducts = products.filter((product) => product.gender === 'male');

  res.status(200).json({
    status: 'success',
    results: menProducts.length,
    data: {
      products: menProducts,
    },
  });
});

export const getWomenProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  const womenProducts = products.filter(
    (product) => product.gender === 'female'
  );

  res.status(200).json({
    status: 'success',
    results: womenProducts.length,
    data: {
      products: womenProducts,
    },
  });
});

export const getUnisexProducts = catchAsync(async (req, res) => {
  const products = await Product.find();

  const unisexProducts = products.filter(
    (product) => product.gender === 'unisex'
  );

  res.status(200).json({
    status: 'success',
    results: unisexProducts.length,
    data: {
      products: unisexProducts,
    },
  });
});

export const getFeaturedProducts = catchAsync(async (req, res) => {
  let products = await Product.find();
  products = products.filter((product) => product.isFeatured === true);

  res.status(200).json({
    status: 'success',
    data: {
      products,
    },
  });
});

export const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new AppError('No product found with that id', 404));

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

export const addProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      newProduct,
    },
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProduct)
    return next(new AppError('No product found with that ID', 404));

  res.status(200).json({
    status: 'success',
    data: {
      updatedProduct,
    },
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  if (!deletedProduct)
    return next(new AppError('No product found with that ID', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

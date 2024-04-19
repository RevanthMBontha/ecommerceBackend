import axios from 'axios';
import Order from '../models/orderModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import User from '../models/userModel.js';

// const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = 'https://api-m.sandbox.paypal.com';

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 * @see https://developer.paypal.com/api/rest/authentication/
 */
const generateAccessToken = async () => {
  try {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error('MISSING_API_CREDENTIALS');
    }
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET
    ).toString('base64');
    const response = await axios.post(
      `${base}/v1/oauth2/token`,

      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = response.data;
    return data.access_token;
  } catch (error) {
    console.error('Failed to generate Access Token:', error);
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (cart, tax, deliveryFee) => {
  let cartValue = cart
    .map((item) => item.price * item.quantity)
    .reduce((acc, cv) => acc + cv);

  cartValue = cartValue + tax + deliveryFee;

  let stringCartValue = cartValue.toFixed(2);

  const accessToken = await generateAccessToken();

  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: stringCartValue,
        },
      },
    ],
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Failed to create order:', error);
    throw new Error('Failed to create order.');
  }
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  try {
    const response = await axios.post(url, null, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to capture order:', error);
    throw new Error('Failed to capture order.');
  }
};

const handleResponse = (response) => {
  const jsonResponse = response.data;
  const httpStatusCode = response.status;
  return {
    jsonResponse,
    httpStatusCode,
  };
};

export const getAllOrdersByUser = catchAsync(async (req, res, next) => {
  const data = await User.findById(req.user.id).populate('orders');

  const orders = data.orders;

  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });
});

export const newOrder = catchAsync(async (req, res) => {
  const cart = req.body.cart;
  const address = req.body.address;

  const test = cart.map((product) => {
    return { product: product.id, quantity: product.quantity };
  });

  const order = {
    products: test,
    user: req.user.id,
    address: req.body.address._id,
    deliveryFee: req.body.deliveryFee,
  };

  const newOrder = new Order(order);
  const addedOrder = await newOrder.save();

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      $push: { orders: addedOrder._id },
    },
    { new: true }
  );

  const { jsonResponse, httpStatusCode } = await createOrder(
    req.body.cart,
    req.body.tax,
    req.body.deliveryFee
  );
  res.status(httpStatusCode).json(jsonResponse);
});

export const capOrder = catchAsync(async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to capture order.' });
  }
});

export const getSpecificOrder = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const order = await Order.findById(id)
    .populate('products.product')
    .populate('address');

  res.status(200).json({
    status: 'success',
    data: {
      order,
    },
  });
});

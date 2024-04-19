import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Add CORS middleware
// Enable CORS middleware for all routes
app.use(cors());

// Handle preflight OPTIONS requests for all routes
app.options('*', (req, res) => {
  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(200).send();
});

// Adding the requested time to the req body
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/user', addressRoutes);
app.use('/api/v1/user', orderRoutes);
app.use('/api/v1/messages', messageRoutes);

export default app;

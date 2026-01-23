import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// 🔐 hanya dari gateway
app.use((req, res, next) => {
  console.log('Incoming X-INTERNAL-KEY:', req.headers['x-internal-key']);
  console.log('Expected INTERNAL_KEY:', process.env.INTERNAL_KEY);

  if (req.headers['x-internal-key'] !== process.env.INTERNAL_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
});

import authRoutes from './routes/auth.route.js';
app.use('/', authRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log('Auth service running on port 3001');
});

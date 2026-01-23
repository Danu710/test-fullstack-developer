import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import rbacRoutes from './routes/rbac.route.js';
import productRoutes from './routes/product.route.js';
import transactionRoutes from './routes/transaction.route';

import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

// ⬇️ INI KUNCI UTAMA
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use('/api', authRoutes);
app.use('/api', rbacRoutes);
app.use('/api', productRoutes);
app.use('/api', transactionRoutes);

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});

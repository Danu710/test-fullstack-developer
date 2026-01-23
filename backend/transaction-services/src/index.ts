import express from 'express';
import dotenv from 'dotenv';
import cartRoutes from './routes/cart.route';
import transactionRoutes from './routes/transaction.route';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cartRoutes);
app.use(transactionRoutes);

app.listen(3005, () => {
  console.log('Product Service running on port 3005');
});

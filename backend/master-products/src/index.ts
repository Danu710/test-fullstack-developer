import 'dotenv/config';
import express from 'express';
import productRoutes from './routes/product.route';

const app = express();
app.use(express.json());

// INTERNAL SECURITY (WAJIB)
app.use((req, res, next) => {
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
});

app.use('/', productRoutes);

app.listen(3003, () => {
  console.log('Product Service running on port 3003');
});

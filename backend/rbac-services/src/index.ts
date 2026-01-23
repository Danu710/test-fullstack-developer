import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// health check (opsional tapi nilai plus)
app.get('/health', (_, res) => {
  res.json({ status: 'RBAC Service running' });
});

import userRoutes from './routes/user.routes';
// RBAC private routes
app.use('/', userRoutes);

// fallback error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`RBAC Service running on port ${PORT}`);
});

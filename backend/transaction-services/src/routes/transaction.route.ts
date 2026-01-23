import express from 'express';
import {
  checkout,
  getTransactions,
  payTransaction,
  getAllTransactions,
} from '../controllers/transaction.controller';

const router = express.Router();

router.post('/checkout', checkout);
router.get('/transactions/:pembeli_id', getTransactions);
router.put('/transactions/:id/pay', payTransaction);
router.get('/transactions', getAllTransactions);

export default router;

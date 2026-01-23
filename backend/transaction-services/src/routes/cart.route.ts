import express from 'express';
import { addToCart, getCart } from '../controllers/cart.controller';

const router = express.Router();

router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.get('/cart/:pembeli_id', getCart);

export default router;

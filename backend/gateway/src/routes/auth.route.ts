import express from 'express';
import axios from 'axios';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    console.log('Gateway sending key:', process.env.INTERNAL_KEY);

    const response = await axios.post(
      'http://localhost:3001/login', // auth-service PORT 3000 (sesuai log Anda)
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error('AUTH SERVICE RESPONSE:', err?.response?.data);
    res
      .status(err?.response?.status || 500)
      .json(err?.response?.data || { message: 'Login failed' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/me`, {
      headers: {
        'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
        'x-user': JSON.stringify(req.user),
      },
    });

    return res.status(200).json(response.data);
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;

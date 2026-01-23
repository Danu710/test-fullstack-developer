import express from 'express';
import { login } from '../services/auth.service.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    res.json({ token });
  } catch (err) {
    console.error('AUTH ROUTE ERROR:', err);
    res.status(401).json({ message: 'Login failed' });
  }
});

router.get('/me', async (req, res) => {
  try {
    // payload sudah diinject oleh gateway
    return res.status(200).json(req.headers['x-user']);
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

export default router;

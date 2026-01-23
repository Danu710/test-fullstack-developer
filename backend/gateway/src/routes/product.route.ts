import express from 'express';
import axios from 'axios';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { gatewaySecurity } from '../middleware/gateway-security';

const router = express.Router();

// READ: ADMIN + PEMBELI
router.get('/products', authMiddleware, gatewaySecurity, async (_req, res) => {
  const response = await axios.get(
    `${process.env.PRODUCT_SERVICE_URL}/products`,
    { headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY } }
  );
  res.json(response.data);
});

router.get(
  '/products/:id',
  authMiddleware,
  gatewaySecurity, // ❗ TANPA authMiddleware
  async (req, res) => {
    try {
      const response = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/products/${req.params.id}`,
        {
          headers: {
            'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'Product service error' });
    }
  }
);

// WRITE: ADMIN ONLY
router.post(
  '/products',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${process.env.PRODUCT_SERVICE_URL}/products`,
        req.body,
        { headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY } }
      );
      res.status(201).json(response.data);
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'Product Service error' });
    }
  }
);

// UPDATE
router.put(
  '/products/:id',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.put(
        `${process.env.PRODUCT_SERVICE_URL}/products/${req.params.id}`,
        req.body,
        { headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY } }
      );
      res.json(response.data);
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'Product Service error' });
    }
  }
);

// DELETE
router.delete(
  '/products/:id',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      await axios.delete(
        `${process.env.PRODUCT_SERVICE_URL}/products/${req.params.id}`,
        { headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY } }
      );
      res.status(204).send();
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'Product Service error' });
    }
  }
);

export default router;

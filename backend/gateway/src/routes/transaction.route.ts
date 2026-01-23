import express from 'express';
import axios from 'axios';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { gatewaySecurity } from '../middleware/gateway-security';

const router = express.Router();

/**
 * =========================
 * CART
 * =========================
 */

// PEMBELI - add to cart
router.post(
  '/cart/add',
  authMiddleware,
  requireRole('PEMBELI'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${process.env.TRANSACTION_SERVICE_URL}/cart/add`,
        req.body,
        {
          headers: {
            'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
            'x-user-id': req.user.user_id,
            'x-user-role': req.user.role,
            Authorization: req.headers.authorization, // ⬅️ INI KUNCI UTAMA
          },
        }
      );

      res.status(201).json(response.data);
    } catch (error) {
      console.error('CART ERROR:', error?.response?.data || error.message);
      res
        .status(error?.response?.status || 500)
        .json(
          error?.response?.data || { message: 'Transaction service error' }
        );
      console.log('CART ERROR STATUS:', error?.response?.status);
    }
  }
);

// PEMBELI - lihat cart
router.get(
  '/cart',
  authMiddleware,
  requireRole('PEMBELI'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${process.env.TRANSACTION_SERVICE_URL}/cart`,
        {
          headers: {
            'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
            'x-user-id': req.user.user_id, // ⬅️ sumber identitas
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error('GET CART ERROR:', error?.response?.data || error.message);
      return res
        .status(error?.response?.status || 500)
        .json(
          error?.response?.data || { message: 'Transaction service error' }
        );
    }
  }
);

/**
 * =========================
 * CHECKOUT & TRANSACTIONS
 * =========================
 */

// PEMBELI - checkout
router.post(
  '/checkout',
  authMiddleware,
  requireRole('PEMBELI'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${process.env.TRANSACTION_SERVICE_URL}/checkout`,
        {},
        {
          headers: {
            'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
            'x-user-id': req.user.user_id,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error('CHECKOUT GATEWAY ERROR:', error?.response?.data);
      res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'Checkout failed' });
    }
  }
);

// PEMBELI - riwayat transaksi
router.get(
  '/transactions',
  authMiddleware,
  requireRole('PEMBELI'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${process.env.TRANSACTION_SERVICE_URL}/transactions/${req.user.user_id}`,
        {
          headers: {
            'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
            'x-user-id': req.user.user_id,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(
          error?.response?.data || { message: 'Transaction service error' }
        );
    }
  }
);

// ADMIN - lihat semua transaksi
router.get(
  '/admin/transactions',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.get(
        `${process.env.TRANSACTION_SERVICE_URL}/transactions`,
        {
          headers: {
            'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      res
        .status(error?.response?.status || 500)
        .json({ message: 'Transaction service error' });
    }
  }
);

// ADMIN - update pembayaran
router.put(
  '/transactions/:id/pay',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.put(
        `${process.env.TRANSACTION_SERVICE_URL}/transactions/${req.params.id}/pay`,
        {},
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
        .json(
          error?.response?.data || { message: 'Transaction service error' }
        );
    }
  }
);

export default router;

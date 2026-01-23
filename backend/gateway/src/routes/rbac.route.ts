import express from 'express';
import axios from 'axios';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware';
import { gatewaySecurity } from '../middleware/gateway-security';

const router = express.Router();

router.get(
  '/users',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (_req, res) => {
    try {
      const response = await axios.get(
        `${process.env.RBAC_SERVICE_URL}/users`,
        {
          headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('RBAC ERROR:', error?.response?.data || error.message);

      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'RBAC Service error' });
    }
  }
);

// CREATE USER
router.post(
  '/users',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.post(
        `${process.env.RBAC_SERVICE_URL}/add_users`,
        req.body,
        {
          headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY },
        }
      );

      res.json(response.data);
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'RBAC Service error' });
    }
  }
);

// UPDATE USER
router.put(
  '/users/:id',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.put(
        `${process.env.RBAC_SERVICE_URL}/update_users/${req.params.id}`,
        req.body,
        {
          headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY },
        }
      );

      res.json(response.data);
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'RBAC Service error' });
    }
  }
);

// DELETE USER
router.delete(
  '/users/:id',
  authMiddleware,
  requireRole('ADMIN'),
  gatewaySecurity,
  async (req, res) => {
    try {
      const response = await axios.delete(
        `${process.env.RBAC_SERVICE_URL}/delete_users/${req.params.id}`,
        {
          headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY },
        }
      );

      res.json(response.data);
    } catch (error) {
      return res
        .status(error?.response?.status || 500)
        .json(error?.response?.data || { message: 'RBAC Service error' });
    }
  }
);

export default router;

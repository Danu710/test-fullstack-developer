import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';

export const internalOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers['x-internal-key'] !== process.env.INTERNAL_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

export const rbacAdminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

export const rbacClient = axios.create({
  baseURL: process.env.RBAC_SERVICE_URL,
  headers: {
    'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
  },
});

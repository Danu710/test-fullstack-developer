import express from 'express';
import { login } from '../services/auth.service.js';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';

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

router.post('/register-internal', async (req, res) => {
  try {
    const { id, email, password, name, role } = req.body;

    // Hash password di sini sebelum simpan ke db_auth
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { email: email }, // Identitas unik untuk cek data sudah ada atau belum
      update: {
        name,
        password: hashedPassword,
        role: {
          update: { role }, // Jika user ada, update role-nya
        },
      },
      create: {
        id, // Masukkan ID dari RBAC
        email,
        name,
        password: hashedPassword,
        role: {
          create: { role }, // Jika user baru, buat role-nya
        },
      },
    });

    res.status(201).json({ message: 'Auth data synchronized successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Sync failed', error: err.message });
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

router.delete('/delete-internal/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Hapus User di db_auth (Pastikan id-nya sama)
    await prisma.userRole.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    res.json({ message: 'Auth data deleted' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete auth data', error: err.message });
  }
});

export default router;

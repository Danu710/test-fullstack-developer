import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import axios from 'axios';

export const getUsers = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { role: true },
  });
  res.json(users);
};

export const addUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Jalankan pembuatan user di RBAC
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: 'MOCK_PASSWORD',
        role: { create: { role: role.toUpperCase() } }, // Pakai toUpperCase untuk jaga-jaga Enum
      },
      include: { role: true }, // Agar data role ikut terbawa
    });

    // 2. Kirim ke Auth Service
    try {
      await axios.post(
        'http://localhost:3001/register-internal',
        {
          id: user.id,
          email,
          password,
          name,
          role: role.toUpperCase(),
        },
        {
          headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY },
        }
      );

      // Jika semua sukses
      const { password: _, ...userWithoutPassword } = user; // Buang field password dari response
      return res.status(201).json(userWithoutPassword);
    } catch (authError) {
      // ROLLBACK: Jika Auth gagal, hapus user yang tadi sempat dibuat di RBAC
      await prisma.user.delete({ where: { id: user.id } });

      console.error(
        'Auth Sync Error:',
        authError?.response?.data || authError.message
      );
      return res
        .status(500)
        .json({ message: 'Failed to sync with Auth Service' });
    }
  } catch (error) {
    console.error('RBAC Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status, role } = req.body;

  await prisma.user.update({
    where: { id },
    data: {
      name,
      status,
      role: role
        ? {
            update: { role },
          }
        : undefined,
    },
  });

  res.json({ message: 'User updated' });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // 1. Cek apakah user ada di RBAC
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found in RBAC' });
    }

    // 2. Hapus di Database RBAC (UserRole akan terhapus jika pakai Cascade,
    // jika tidak, hapus UserRole manual dulu seperti kode Anda sebelumnya)
    await prisma.userRole.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    // 3. Instruksikan Auth Service untuk menghapus kredensial login
    try {
      await axios.delete(`http://localhost:3001/delete-internal/${id}`, {
        headers: { 'X-INTERNAL-KEY': process.env.INTERNAL_KEY },
      });
    } catch (authError) {
      // Jika di Auth gagal, kita log saja (atau bisa buat mekanisme retry)
      console.error('Gagal menghapus data di Auth Service:', authError.message);
    }

    res.json({ message: 'User deleted successfully from both services' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

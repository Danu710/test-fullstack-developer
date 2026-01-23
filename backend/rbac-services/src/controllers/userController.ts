import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getUsers = async (_: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: { role: true },
  });
  res.json(users);
};

export const addUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: {
        create: { role },
      },
    },
  });

  res.status(201).json(user);
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

  await prisma.userRole.delete({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  res.json({ message: 'User deleted' });
};

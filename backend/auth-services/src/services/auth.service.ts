import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      role: true, // relasi ke users_role
    },
  });

  console.log('USER FROM DB:', user);

  if (!user || user.status !== true) {
    throw new Error('Login failed');
  }

  const isValid = await bcrypt.compare(password, user.password);
  console.log('PASSWORD MATCH:', isValid);

  if (!isValid) {
    throw new Error('Login failed');
  }

  const token = jwt.sign(
    {
      user_id: user.id,
      email: user.email,
      role: user.role.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' }
  );

  return token;
};

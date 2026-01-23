import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const buyerPassword = await bcrypt.hash('buyer123', 10);

  // ADMIN
  await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@mail.com',
      password: hashedPassword,
      status: true,
      role: {
        create: { role: 'ADMIN' },
      },
    },
  });

  // PEMBELI
  await prisma.user.upsert({
    where: { email: 'buyer@mail.com' },
    update: {},
    create: {
      name: 'Pembeli',
      email: 'buyer@mail.com',
      password: buyerPassword,
      status: true,
      role: {
        create: { role: 'PEMBELI' },
      },
    },
  });

  console.log('✅ Seed admin & pembeli selesai');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

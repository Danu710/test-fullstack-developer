import { prisma } from '../lib/prisma';

export const checkout = async (req, res) => {
  try {
    const pembeli_id = req.headers['x-user-id'];

    if (!pembeli_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // 1️⃣ Cari transaksi aktif
    const transaksi = await prisma.transaction.findFirst({
      where: {
        pembeli_id,
        status: 'BELUM_DIBAYAR',
      },
      include: {
        carts: true,
      },
    });

    if (!transaksi || transaksi.carts.length === 0) {
      return res.status(400).json({ message: 'Cart kosong' });
    }

    // 2️⃣ Hitung total (SERVER SIDE)
    const total = transaksi.carts.reduce(
      (sum, item) => sum + Number(item.harga),
      0
    );

    // 3️⃣ Update transaksi
    const updated = await prisma.transaction.update({
      where: { id: transaksi.id },
      data: {
        total_harga: total,
        kode_billing: `INV-${Date.now()}`,
        expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      transaksi_id: updated.id,
      kode_billing: updated.kode_billing,
      total_harga: updated.total_harga,
      expired_at: updated.expired_at,
      status: updated.status,
    });
  } catch (error) {
    console.error('CHECKOUT ERROR:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTransactions = async (req, res) => {
  const pembeli_id = req.headers['x-user-id'];

  if (!pembeli_id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const transactions = await prisma.transaction.findMany({
    where: { pembeli_id },
    include: { carts: true },
    orderBy: { created_at: 'desc' },
  });

  res.json(transactions);
};

// ADMIN - get all transactions
export const getAllTransactions = async (_req, res) => {
  const data = await prisma.transaction.findMany({
    include: { carts: true },
  });

  res.json(data);
};

export const payTransaction = async (req, res) => {
  const { id } = req.params;

  const trx = await prisma.transaction.findUnique({ where: { id } });

  if (!trx) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  if (trx.status === 'SUDAH_DIBAYAR') {
    return res.status(400).json({ message: 'Already paid' });
  }

  if (trx.expired_at < new Date()) {
    return res.status(400).json({ message: 'Transaction expired' });
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: { status: 'SUDAH_DIBAYAR' },
  });

  res.json({
    id: updated.id,
    status: updated.status,
    kode_billing: updated.kode_billing,
  });
};

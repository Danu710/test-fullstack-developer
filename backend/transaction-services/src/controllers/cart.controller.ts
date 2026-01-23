import axios from 'axios';
import { prisma } from '../lib/prisma';

export const addToCart = async (req, res) => {
  try {
    const { product_id } = req.body;
    console.log('==== ADD TO CART HIT ====');
    console.log('BODY:', req.body);
    console.log('HEADERS:', req.headers);
    const pembeliId = req.headers['x-user-id'];

    if (!product_id || !pembeliId) {
      return res.status(400).json({ message: 'Invalid input' });
    }
    console.log('PRODUCT ID:', product_id);
    console.log('PEMBELI ID:', pembeliId);

    // 1️⃣ Ambil data produk dari API Gateway
    const productResponse = await axios.get(
      `${process.env.API_GATEWAY_URL}/api/products/${product_id}`,
      {
        headers: {
          'X-INTERNAL-KEY': process.env.INTERNAL_KEY,
          Authorization: req.headers.authorization, // ⬅️ INI KUNCI
        },
      }
    );

    const product = productResponse.data;

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // 2️⃣ Cari transaksi BELUM_DIBAYAR
    let transaksi = await prisma.transaction.findFirst({
      where: {
        pembeli_id: pembeliId,
        status: 'BELUM_DIBAYAR',
      },
    });

    // 3️⃣ Kalau belum ada → buat transaksi baru
    if (!transaksi) {
      transaksi = await prisma.transaction.create({
        data: {
          pembeli_id: pembeliId,
          kode_billing: `BILL-${Date.now()}`,
          total_harga: product.harga,
          status: 'BELUM_DIBAYAR',
          expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    }

    // 4️⃣ Masukkan ke keranjang
    const cart = await prisma.cart.create({
      data: {
        transaksi_id: transaksi.id,
        produk_id: product.id,
        harga: product.harga,
      },
    });

    return res.status(201).json(cart);
  } catch (error) {
    console.error('ADD TO CART ERROR:', error);
    console.error('TRANSACTION ERROR FULL:', error);
    console.error('ERROR MESSAGE:', error.message);
    console.error('ERROR STACK:', error.stack);
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getCart = async (req, res) => {
  try {
    const pembeli_id = req.headers['x-user-id'];

    if (!pembeli_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const transaksi = await prisma.transaction.findFirst({
      where: {
        pembeli_id,
        status: 'BELUM_DIBAYAR',
      },
      include: {
        carts: true,
      },
    });

    if (!transaksi) {
      return res.json({
        items: [],
        total: 0,
      });
    }

    const total = transaksi.carts.reduce(
      (sum, item) => sum + Number(item.harga),
      0
    );

    return res.json({
      transaksi_id: transaksi.id,
      items: transaksi.carts,
      total,
    });
  } catch (error) {
    console.error('GET CART ERROR:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

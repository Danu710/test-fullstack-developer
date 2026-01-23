import { prisma } from '../lib/prisma';

export const getProducts = async (_req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, harga } = req.body;

  if (!name || harga == null || harga < 0) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const product = await prisma.product.create({
    data: { name, harga },
  });

  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, harga } = req.body;

  if (harga != null && harga < 0) {
    return res.status(400).json({ message: 'Invalid price' });
  }

  const product = await prisma.product.update({
    where: { id },
    data: { name, harga },
  });

  res.json(product);
};

export const deleteProduct = async (req, res) => {
  await prisma.product.delete({
    where: { id: req.params.id },
  });

  res.status(204).send();
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
};

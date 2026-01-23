import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsApi, deleteProductApi } from '../../api/product.api';
import { addToCartApi } from '../../api/transaction.api';
import ProductModal from './ProductModal';

export default function ProductList() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProductsApi,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleAddToCart = async (id: string) => {
    await addToCartApi(id);
    alert('Produk ditambahkan ke keranjang');
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Gagal memuat data produk</div>;

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h2 className='text-xl font-semibold'>Master Produk</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setOpen(true);
          }}
          className='bg-blue-600 text-white px-4 py-2'>
          Tambah Produk
        </button>
      </div>

      <table className='w-full bg-white border'>
        <thead>
          <tr className='border-b'>
            <th>Nama</th>
            <th>Harga</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((product: any) => (
            <tr key={product.id} className='border-b text-center'>
              <td>{product.name}</td>
              <td>{product.harga}</td>
              <td>{product.status ? 'Aktif' : 'Nonaktif'}</td>
              <td>
                <button
                  className='text-blue-600'
                  onClick={() => {
                    setSelectedProduct(product);
                    setOpen(true);
                  }}>
                  Edit
                </button>

                <button
                  className='text-red-600 ml-2'
                  onClick={() => {
                    if (confirm('Yakin hapus produk?')) {
                      deleteMutation.mutate(product.id);
                    }
                  }}>
                  Hapus
                </button>
                <button
                  className='bg-blue-600 text-white px-2 py-1 mt-2'
                  onClick={() => handleAddToCart(product.id)}>
                  Tambah ke Keranjang
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

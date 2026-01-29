import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductsApi, deleteProductApi } from '../../api/product.api';
import { addToCartApi } from '../../api/transaction.api';
import ProductModal from './ProductModal';
import { useAuthStore } from '../../store/auth.store';

export default function ProductList() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const user = useAuthStore((s) => s.user);

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

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Master Produk</h2>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => {
              setSelectedProduct(null);
              setOpen(true);
            }}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'>
            Tambah Produk
          </button>
        )}
      </div>

      {isLoading && <div className='text-sm text-gray-500'>Loading...</div>}
      {error && (
        <div className='text-sm text-red-500'>Gagal memuat data produk</div>
      )}

      {!isLoading && data?.data?.length === 0 && (
        <div className='text-sm text-gray-500'>Data produk belum tersedia</div>
      )}

      {!isLoading && data?.data?.length > 0 && (
        <div className='overflow-hidden bg-white border rounded-lg'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-3 text-left'>Nama Produk</th>
                <th className='px-4 py-3 text-left'>Harga</th>
                <th className='px-4 py-3 text-center'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((product: any) => (
                <tr key={product.id} className='border-t'>
                  <td className='px-4 py-3'>{product.name}</td>
                  <td className='px-4 py-3'>
                    Rp {product.harga.toLocaleString()}
                  </td>
                  <td className='px-4 py-3 text-center'>
                    <div className='flex justify-center gap-3'>
                      {user?.role === 'ADMIN' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setOpen(true);
                            }}
                            className='text-blue-600 hover:underline'>
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Yakin hapus produk?')) {
                                deleteMutation.mutate(product.id);
                              }
                            }}
                            className='text-red-600 hover:underline'>
                            Hapus
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className='px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700'>
                        + Keranjang
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

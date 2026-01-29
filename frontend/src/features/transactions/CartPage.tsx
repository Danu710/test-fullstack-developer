import { useQuery, useMutation } from '@tanstack/react-query';
import { getCartApi, checkoutApi } from '../../api/transaction.api';

export default function CartPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: getCartApi,
  });

  const checkoutMutation = useMutation({
    mutationFn: checkoutApi,
    onSuccess: () => {
      alert('Checkout berhasil');
      refetch();
    },
  });

  const cartItems = Array.isArray(data?.data?.items) ? data.data.items : [];
  const total = data?.data?.total ?? 0;

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-xl font-semibold'>Keranjang Belanja</h1>
        <p className='text-sm text-gray-500'>Daftar produk yang akan dibeli</p>
      </div>

      {isLoading && (
        <div className='text-sm text-gray-500'>Memuat keranjang...</div>
      )}

      {error && (
        <div className='text-sm text-red-500'>Gagal memuat data keranjang</div>
      )}

      {!isLoading && cartItems.length === 0 && (
        <div className='p-6 text-sm text-center text-gray-500 border border-dashed rounded-md'>
          Keranjang masih kosong
        </div>
      )}

      {!isLoading && cartItems.length > 0 && (
        <>
          {/* Cart Items */}
          <div className='space-y-3'>
            {cartItems.map((item: any) => (
              <div
                key={item.id}
                className='flex items-center justify-between p-4 bg-white border rounded-lg'>
                <div>
                  <p className='text-sm font-medium'>
                    Produk ID: {item.produk_id}
                  </p>
                  <p className='text-xs text-gray-500'>Harga satuan</p>
                </div>

                <div className='text-sm font-semibold'>
                  Rp {item.harga.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className='p-4 border rounded-lg bg-gray-50'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Total Pembayaran</span>
              <span className='text-lg font-semibold'>
                Rp {total.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
              className='w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-60'>
              {checkoutMutation.isPending ? 'Memproses...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

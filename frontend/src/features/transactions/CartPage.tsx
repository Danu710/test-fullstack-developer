import { useQuery, useMutation } from '@tanstack/react-query';
import {
  addToCartApi,
  getCartApi,
  checkoutApi,
} from '../../api/transaction.api';

export default function CartPage() {
  const { data, refetch } = useQuery({
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
    <div>
      <h1 className='text-xl font-bold mb-4'>Keranjang</h1>

      {cartItems.length === 0 && <p>Keranjang kosong</p>}

      <ul className='space-y-2'>
        {cartItems.map((item: any) => (
          <li key={item.id} className='border p-2'>
            Produk ID: {item.produk_id} <br />
            Harga: Rp {item.harga}
          </li>
        ))}
      </ul>

      {cartItems.length > 0 && (
        <div className='mt-4'>
          <p>Total: Rp {total}</p>

          <button
            className='bg-green-600 text-white px-4 py-2 mt-2'
            onClick={() => checkoutMutation.mutate()}
            disabled={checkoutMutation.isPending}>
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

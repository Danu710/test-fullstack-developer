import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllTransactionsApi,
  payTransactionApi,
} from '../../api/transaction.api';

export default function AdminTransactionPage() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: getAllTransactionsApi,
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => payTransactionApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      alert('Transaksi berhasil dibayar');
    },
  });

  const transactions = data?.data || [];

  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>Manajemen Transaksi</h1>

      {transactions.length === 0 && <p>Tidak ada transaksi</p>}

      <table className='w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border p-2'>Kode Billing</th>
            <th className='border p-2'>Total</th>
            <th className='border p-2'>Status</th>
            <th className='border p-2'>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((trx: any) => (
            <tr key={trx.id}>
              <td className='border p-2'>{trx.kode_billing}</td>
              <td className='border p-2'>Rp {trx.total_harga}</td>
              <td className='border p-2'>{trx.status}</td>
              <td className='border p-2'>
                {trx.status === 'BELUM_DIBAYAR' && (
                  <button
                    className='bg-green-600 text-white px-2 py-1'
                    onClick={() => payMutation.mutate(trx.id)}>
                    Tandai Lunas
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

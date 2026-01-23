import { useQuery } from '@tanstack/react-query';
import { getTransactionsApi } from '../../api/transaction.api';

export default function TransactionHistory() {
  const { data } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactionsApi,
  });

  const transactions = data?.data || [];

  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>Riwayat Transaksi</h1>

      {transactions.length === 0 && <p>Belum ada transaksi</p>}

      <ul className='space-y-3'>
        {transactions.map((trx: any) => (
          <li key={trx.id} className='border p-3'>
            <p>Kode Billing: {trx.kode_billing}</p>
            <p>Status: {trx.status}</p>
            <p>Total: Rp {trx.total_harga}</p>
            <p>Expired: {new Date(trx.expired_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

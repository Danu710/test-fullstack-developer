import { useQuery } from '@tanstack/react-query';
import { getTransactionsApi } from '../../api/transaction.api';

export default function TransactionHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactionsApi,
  });

  const transactions = data?.data ?? [];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-xl font-semibold'>Riwayat Transaksi</h1>
        <p className='text-sm text-gray-500'>
          Daftar transaksi yang pernah Anda lakukan
        </p>
      </div>

      {isLoading && (
        <div className='text-sm text-gray-500'>Memuat transaksi...</div>
      )}

      {error && (
        <div className='text-sm text-red-500'>Gagal memuat data transaksi</div>
      )}

      {!isLoading && transactions.length === 0 && (
        <div className='p-6 text-sm text-center text-gray-500 border border-dashed rounded-md'>
          Belum ada transaksi
        </div>
      )}

      {!isLoading && transactions.length > 0 && (
        <div className='space-y-4'>
          {transactions.map((trx: any) => (
            <div key={trx.id} className='p-4 bg-white border rounded-lg'>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm font-medium'>Kode Billing</p>
                  <p className='text-sm text-gray-700'>{trx.kode_billing}</p>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    trx.status === 'BELUM_DIBAYAR'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                  {trx.status === 'BELUM_DIBAYAR' ? 'Belum Dibayar' : 'Lunas'}
                </span>
              </div>

              <div className='grid grid-cols-2 gap-4 mt-3 text-sm'>
                <div>
                  <p className='text-xs text-gray-500'>Total</p>
                  <p className='font-semibold'>
                    Rp {trx.total_harga.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className='text-xs text-gray-500'>Berlaku sampai</p>
                  <p>{new Date(trx.expired_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

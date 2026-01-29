import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllTransactionsApi,
  payTransactionApi,
} from '../../api/transaction.api';
import ErrorModal from '../../components/components/ErrorModal';

export default function AdminTransactionPage() {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: getAllTransactionsApi,
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => payTransactionApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || 'Terjadi kesalahan pada transaksi';
      setErrorMessage(message);
    },
  });

  const transactions = data?.data ?? [];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-xl font-semibold'>Manajemen Transaksi</h1>
        <p className='text-sm text-gray-500'>
          Daftar seluruh transaksi dari pengguna
        </p>
      </div>

      {isLoading && (
        <div className='text-sm text-gray-500'>Memuat transaksi...</div>
      )}

      {error && (
        <div className='text-sm text-red-500'>Gagal memuat data transaksi</div>
      )}

      {!isLoading && transactions.length === 0 && (
        <div className='text-sm text-gray-500'>
          Tidak ada transaksi tersedia
        </div>
      )}

      {!isLoading && transactions.length > 0 && (
        <div className='overflow-hidden bg-white border rounded-lg'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-3 text-left'>Kode Billing</th>
                <th className='px-4 py-3 text-left'>Total</th>
                <th className='px-4 py-3 text-left'>Status</th>
                <th className='px-4 py-3 text-center'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx: any) => (
                <tr key={trx.id} className='border-t'>
                  <td className='px-4 py-3'>{trx.kode_billing}</td>
                  <td className='px-4 py-3'>
                    Rp {trx.total_harga.toLocaleString()}
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        trx.status === 'BELUM_DIBAYAR'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                      {trx.status === 'BELUM_DIBAYAR'
                        ? 'Belum Dibayar'
                        : 'Lunas'}
                    </span>
                  </td>
                  <td className='px-4 py-3 text-center'>
                    {trx.status === 'BELUM_DIBAYAR' ? (
                      <button
                        onClick={() => payMutation.mutate(trx.id)}
                        disabled={payMutation.isPending}
                        className='px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-60'>
                        Tandai Lunas
                      </button>
                    ) : (
                      <span className='text-xs text-gray-400'>
                        Tidak ada aksi
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error Modal */}
      {errorMessage && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </div>
  );
}

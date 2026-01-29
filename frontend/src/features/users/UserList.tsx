import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersApi, deleteUserApi } from '../../api/user.api';
import UserModal from './UserModal';
import { useDebounce } from '../../hooks/useDebounce';

export default function UserList() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsersApi,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const filteredUsers = useMemo(() => {
    if (!debouncedSearch) return data?.data ?? [];

    const keyword = debouncedSearch.toLowerCase();

    return data?.data.filter((user: any) => {
      return (
        user.name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword)
      );
    });
  }, [data?.data, debouncedSearch]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Manajemen User</h2>
        <button
          onClick={() => {
            setSelectedUser(null);
            setOpen(true);
          }}
          className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'>
          Tambah User
        </button>
      </div>

      {/* Search */}
      <div className='max-w-sm'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Cari nama atau email...'
          className='w-full px-3 py-2 text-sm border rounded-md focus:border-blue-500 focus:outline-none'
        />
      </div>

      {isLoading && <div className='text-sm text-gray-500'>Loading...</div>}
      {error && (
        <div className='text-sm text-red-500'>Gagal mengambil data</div>
      )}

      {!isLoading && filteredUsers.length === 0 && (
        <div className='text-sm text-gray-500'>User tidak ditemukan</div>
      )}

      {!isLoading && filteredUsers.length > 0 && (
        <div className='overflow-hidden bg-white border rounded-lg'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-3 text-left'>Nama</th>
                <th className='px-4 py-3 text-left'>Email</th>
                <th className='px-4 py-3 text-left'>Role</th>
                <th className='px-4 py-3 text-left'>Status</th>
                <th className='px-4 py-3 text-center'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className='border-t'>
                  <td className='px-4 py-3'>{user.name}</td>
                  <td className='px-4 py-3'>{user.email}</td>
                  <td className='px-4 py-3'>
                    {typeof user.role === 'object' ? user.role.role : user.role}
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        user.status
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                      {user.status ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className='px-4 py-3 space-x-3 text-center'>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setOpen(true);
                      }}
                      className='text-blue-600 hover:underline'>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Yakin hapus user?')) {
                          deleteMutation.mutate(user.id);
                        }
                      }}
                      className='text-red-600 hover:underline'>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <UserModal user={selectedUser} onClose={() => setOpen(false)} />}
    </div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersApi, deleteUserApi } from '../../api/user.api';
import UserModal from './UserModal';

export default function UserList() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Gagal mengambil data user</div>;

  return (
    <div>
      <div className='flex justify-between mb-4'>
        <h2 className='text-xl font-semibold'>Manajemen Users</h2>
        <button
          onClick={() => {
            setSelectedUser(null);
            setOpen(true);
          }}
          className='bg-blue-600 text-white px-4 py-2'>
          Tambah User
        </button>
      </div>

      <table className='w-full bg-white border'>
        <thead>
          <tr className='border-b'>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((user: any) => (
            <tr key={user.id} className='border-b text-center'>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {typeof user.role === 'object' ? user.role.role : user.role}
              </td>
              <td>{user.status ? 'Aktif' : 'Nonaktif'}</td>
              <td>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setOpen(true);
                  }}
                  className='text-blue-600'>
                  Edit
                </button>

                <button
                  onClick={() => {
                    if (confirm('Yakin hapus user?')) {
                      deleteMutation.mutate(user.id);
                    }
                  }}
                  className='text-red-600 ml-2'>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && <UserModal user={selectedUser} onClose={() => setOpen(false)} />}
    </div>
  );
}

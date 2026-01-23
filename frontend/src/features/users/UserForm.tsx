import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserApi, updateUserApi } from '../../api/user.api';

export default function UserForm({ user, onClose }: any) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: user || {
      name: '',
      email: '',
      password: '',
      role: 'PEMBELI',
      status: true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) =>
      user ? updateUserApi(user.id, data) : createUserApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
  });

  const onSubmit = (data: any) => {
    if (!data.password) delete data.password;
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
      <h3 className='text-lg font-semibold'>
        {user ? 'Edit User' : 'Tambah User'}
      </h3>

      <input {...register('name')} placeholder='Nama' />
      <input {...register('email')} placeholder='Email' />

      {!user && (
        <input
          {...register('password')}
          type='password'
          placeholder='Password'
        />
      )}

      <select {...register('role')}>
        <option value='ADMIN'>Admin</option>
        <option value='PEMBELI'>Pembeli</option>
      </select>

      <select {...register('status')}>
        <option value={true}>Aktif</option>
        <option value={false}>Nonaktif</option>
      </select>

      <div className='flex justify-end space-x-2'>
        <button type='button' onClick={onClose}>
          Batal
        </button>
        <button type='submit' className='bg-blue-600 text-white px-4'>
          Simpan
        </button>
      </div>
    </form>
  );
}

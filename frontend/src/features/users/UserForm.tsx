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
    if (user && !data.password) delete data.password;
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <h3 className='text-lg font-semibold'>
        {user ? 'Edit User' : 'Tambah User'}
      </h3>

      <input
        {...register('name')}
        placeholder='Nama'
        className='w-full px-3 py-2 text-sm border rounded-md'
      />

      <input
        {...register('email')}
        placeholder='Email'
        className='w-full px-3 py-2 text-sm border rounded-md'
      />

      {!user && (
        <input
          {...register('password')}
          type='password'
          placeholder='Password'
          className='w-full px-3 py-2 text-sm border rounded-md'
        />
      )}

      <select
        {...register('role')}
        className='w-full px-3 py-2 text-sm border rounded-md'>
        <option value='ADMIN'>Admin</option>
        <option value='PEMBELI'>Pembeli</option>
      </select>

      <select
        {...register('status')}
        className='w-full px-3 py-2 text-sm border rounded-md'>
        <option value='true'>Aktif</option>
        <option value='false'>Nonaktif</option>
      </select>

      <div className='flex justify-end gap-3 pt-2'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 text-sm border rounded-md'>
          Batal
        </button>
        <button
          type='submit'
          className='px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700'>
          Simpan
        </button>
      </div>
    </form>
  );
}

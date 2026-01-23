import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductApi, updateProductApi } from '../../api/product.api';

type ProductFormProps = {
  product?: {
    id: string;
    name: string;
    harga: number;
  };
  onClose: () => void;
};

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: product?.name ?? '',
      harga: product?.harga ?? 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { name: string; harga: number }) =>
      product ? updateProductApi(product.id, data) : createProductApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
    },
  });

  const onSubmit = (data: any) => {
    mutation.mutate({
      name: data.name,
      harga: Number(data.harga),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
      <h3 className='text-lg font-semibold'>
        {product ? 'Edit Produk' : 'Tambah Produk'}
      </h3>

      <input
        {...register('name', { required: true })}
        placeholder='Nama Produk'
        className='border p-2 w-full'
      />

      <input
        {...register('harga', { valueAsNumber: true, min: 0 })}
        type='number'
        placeholder='Harga'
        className='border p-2 w-full'
      />

      <div className='flex justify-end space-x-2'>
        <button type='button' onClick={onClose}>
          Batal
        </button>
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-1'
          disabled={mutation.isPending}>
          Simpan
        </button>
      </div>
    </form>
  );
}

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
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <h3 className='text-lg font-semibold'>
        {product ? 'Edit Produk' : 'Tambah Produk'}
      </h3>

      <input
        {...register('name', { required: true })}
        placeholder='Nama Produk'
        className='w-full px-3 py-2 text-sm border rounded-md'
      />

      <input
        {...register('harga', { valueAsNumber: true, min: 0 })}
        type='number'
        placeholder='Harga'
        className='w-full px-3 py-2 text-sm border rounded-md'
      />

      <div className='flex justify-end gap-3 pt-2'>
        <button
          type='button'
          onClick={onClose}
          className='px-4 py-2 text-sm border rounded-md'>
          Batal
        </button>
        <button
          type='submit'
          disabled={mutation.isPending}
          className='px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60'>
          Simpan
        </button>
      </div>
    </form>
  );
}

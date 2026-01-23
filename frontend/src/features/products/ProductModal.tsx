import ProductForm from './ProductForm';

export default function ProductModal({ product, onClose }: any) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 w-[400px]'>
        <ProductForm product={product} onClose={onClose} />
      </div>
    </div>
  );
}

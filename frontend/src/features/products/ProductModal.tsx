import ProductForm from './ProductForm';

export default function ProductModal({ product, onClose }: any) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
        <ProductForm product={product} onClose={onClose} />
      </div>
    </div>
  );
}

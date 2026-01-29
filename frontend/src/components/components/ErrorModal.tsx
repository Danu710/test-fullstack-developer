type ErrorModalProps = {
  message: string;
  onClose: () => void;
};

export default function ErrorModal({ message, onClose }: ErrorModalProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-sm p-6 bg-white rounded-lg shadow-lg'>
        <h3 className='mb-2 text-lg font-semibold text-red-600'>
          Gagal Memproses
        </h3>

        <p className='mb-4 text-sm text-gray-700'>{message}</p>

        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700'>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

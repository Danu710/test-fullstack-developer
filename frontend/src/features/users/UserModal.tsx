import UserForm from './UserForm';

export default function UserModal({ user, onClose }: any) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-lg'>
        <UserForm user={user} onClose={onClose} />
      </div>
    </div>
  );
}

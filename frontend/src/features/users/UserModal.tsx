import UserForm from './UserForm';

export default function UserModal({ user, onClose }: any) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 w-[400px]'>
        <UserForm user={user} onClose={onClose} />
      </div>
    </div>
  );
}

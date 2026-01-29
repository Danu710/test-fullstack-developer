import { useAuthStore } from '../../store/auth.store';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { loginApi } from '../../api/auth.api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    const res = await loginApi(data);

    const token = res.data.token;
    localStorage.setItem('token', token);

    const decoded: any = jwtDecode(token);

    useAuthStore.getState().setUser({
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    });

    navigate('/dashboard');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white shadow-md rounded-xl'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold text-gray-800'>Login</h1>
          <p className='text-sm text-gray-500'>Masuk ke sistem Dompet PNBP</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* Email */}
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Email
            </label>
            <input
              type='email'
              {...register('email')}
              placeholder='example@email.com'
              className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          {/* Password */}
          <div>
            <label className='block mb-1 text-sm font-medium text-gray-700'>
              Password
            </label>
            <input
              type='password'
              {...register('password')}
              placeholder='••••••••'
              className='w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
            />
          </div>

          {/* Button */}
          <button
            type='submit'
            className='w-full py-2 text-sm font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

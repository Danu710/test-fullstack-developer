import { useAuthStore } from '../../store/auth.store';
import { jwtDecode } from 'jwt-decode';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '@heroui/react';
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
    <div className='flex h-screen items-center justify-center'>
      <Card className='w-[400px] p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Input label='Email' {...register('email')} />
          <Input label='Password' type='password' {...register('password')} />
          <Button color='primary' type='submit' fullWidth>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}

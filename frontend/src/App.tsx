import { Button } from '@heroui/react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4'>
      <h1 className='text-4xl font-bold text-blue-500'>HeroUI + Tailwind v4</h1>

      <div className='flex gap-2'>
        {/* Button dengan styling HeroUI dan Tailwind */}
        <Button
          onClick={() => navigate('/login')}
          color='primary'
          variant='solid'
          size='lg'>
          Login
        </Button>

        <Button color='secondary' variant='ghost' className='border-2'>
          Ghost Button
        </Button>
      </div>

      <p className='mt-4 text-gray-500'>
        Jika tombol di atas berwarna biru dan melengkung, setup berhasil!
      </p>
    </div>
  );
}

export default App;

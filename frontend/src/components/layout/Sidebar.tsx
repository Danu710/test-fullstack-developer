import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='w-64 bg-blue-600 text-white h-screen p-4'>
      <h1 className='text-xl font-bold mb-6'>DOMPET PNBP</h1>

      <nav className='space-y-4 flex flex-col'>
        <NavLink to='/dashboard'>Dashboard</NavLink>
        <NavLink to='/users'>Users</NavLink>
        <NavLink to='/products'>Master Produk</NavLink>

        {user?.role === 'PEMBELI' && (
          <>
            <NavLink to='/cart'>Keranjang</NavLink>
            <NavLink to='/transactions'>Riwayat</NavLink>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <NavLink to='/admin/transactions'>Manajemen Transaksi</NavLink>
        )}

        <button onClick={logout} className='mt-6 text-left'>
          Logout
        </button>
      </nav>
    </div>
  );
}

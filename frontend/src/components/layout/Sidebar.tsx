import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <aside className='flex flex-col w-64 h-screen px-4 py-5 text-white bg-blue-600'>
      {/* Brand */}
      <div className='mb-8'>
        <h1 className='text-xl font-bold tracking-wide'>DOMPET PNBP</h1>
        <p className='text-xs text-white/70'>Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className='flex flex-col flex-1 gap-1'>
        <NavLink to='/dashboard' className={linkClass}>
          Dashboard
        </NavLink>

        {user?.role === 'ADMIN' && (
          <NavLink to='/users' className={linkClass}>
            Users
          </NavLink>
        )}

        <NavLink to='/products' className={linkClass}>
          Master Produk
        </NavLink>

        {user?.role === 'PEMBELI' && (
          <>
            <div className='mt-4 text-xs tracking-wide uppercase text-white/60'>
              Pembeli
            </div>
            <NavLink to='/cart' className={linkClass}>
              Keranjang
            </NavLink>
            <NavLink to='/transactions' className={linkClass}>
              Riwayat Transaksi
            </NavLink>
          </>
        )}

        {user?.role === 'ADMIN' && (
          <>
            <div className='mt-4 text-xs tracking-wide uppercase text-white/60'>
              Admin
            </div>
            <NavLink to='/admin/transactions' className={linkClass}>
              Manajemen Transaksi
            </NavLink>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className='pt-4'>
        <button
          onClick={logout}
          className='w-full px-3 py-2 text-sm font-medium text-left transition rounded-md text-white/80 hover:bg-white/10 hover:text-white'>
          Logout
        </button>
      </div>
    </aside>
  );
}

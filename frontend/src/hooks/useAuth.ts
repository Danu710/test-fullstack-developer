import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded: any = jwtDecode(token);

    setUser({
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    });
  }, []);
};

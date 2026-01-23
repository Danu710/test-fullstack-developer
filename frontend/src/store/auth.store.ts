import { create } from 'zustand';

type User = {
  user_id: string;
  email: string;
  role: 'ADMIN' | 'PEMBELI';
};

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
}));

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('shopease_token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('shopease_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
      isRole: (...roles) => roles.includes(get().user?.role),
    }),
    {
      name: 'shopease-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
);

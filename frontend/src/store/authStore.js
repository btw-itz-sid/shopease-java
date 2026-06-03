import { create } from 'zustand';
import { authAPI } from '../services/api';

/**
 * Global authentication state managed via Zustand.
 * Persists user session in localStorage and manages JWT tokens.
 */
const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  backendStatus: 'checking', // 'checking' | 'live' | 'offline'

  // Initialize from localStorage on app load
  initialize: () => {
    const storedUser = localStorage.getItem('shopease_user');
    const storedToken = localStorage.getItem('shopease_token');

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        set({ user, token: storedToken, isAuthenticated: true });
      } catch {
        localStorage.removeItem('shopease_user');
        localStorage.removeItem('shopease_token');
      }
    }

    // Check backend health
    get().checkBackendHealth();

    // Listen for auth expiration events from the API interceptor
    window.addEventListener('auth:expired', () => {
      set({ user: null, token: null, isAuthenticated: false });
    });
  },

  // Check if backend is reachable
  checkBackendHealth: async () => {
    try {
      const response = await authAPI.healthCheck();
      if (response.status === 200 || response.status === 400) {
        set({ backendStatus: 'live' });
      }
    } catch {
      set({ backendStatus: 'offline' });
    }
  },

  // Register a new user
  register: async ({ name, email, password, role }) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.register({ name, email, password, role });
      const userData = response.data;

      // If the registration response includes a token, store it
      if (userData.token) {
        localStorage.setItem('shopease_token', userData.token);
      }

      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userData.name?.replace(/\s+/g, '')}`,
      };

      localStorage.setItem('shopease_user', JSON.stringify(user));
      set({ user, token: userData.token, isAuthenticated: true, isLoading: false });

      return { success: true, user, message: 'Account created successfully!' };
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  },

  // Login an existing user
  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login({ email, password });
      const data = response.data;

      if (data.token) {
        localStorage.setItem('shopease_token', data.token);
      }

      const user = {
        id: data.user?.id,
        name: data.user?.name,
        email: data.user?.email,
        role: data.user?.role,
        avatarUrl: data.user?.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.user?.name?.replace(/\s+/g, '')}`,
      };

      localStorage.setItem('shopease_user', JSON.stringify(user));
      set({ user, token: data.token, isAuthenticated: true, isLoading: false });

      return { success: true, user, message: 'Welcome back!' };
    } catch (error) {
      set({ isLoading: false });
      const message = error.response?.data?.error || error.response?.data?.message || 'Invalid credentials';
      return { success: false, error: message };
    }
  },

  // Sign out
  signOut: () => {
    localStorage.removeItem('shopease_token');
    localStorage.removeItem('shopease_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;

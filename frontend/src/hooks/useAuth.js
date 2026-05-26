import { useAuthStore } from '../store';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { login, logout, user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    const res = await authAPI.login(data);
    login(res.data.user, res.data.token);
    toast.success(`Welcome back, ${res.data.user.name}!`);
    const role = res.data.user.role;
    navigate(role === 'seller' ? '/seller' : role === 'admin' ? '/admin' : '/');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return { user, isAuthenticated, handleLogin, handleLogout };
};

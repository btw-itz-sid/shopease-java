import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { authAPI } from './services/api';

import Navbar   from './components/common/Navbar';
import Footer   from './components/common/Footer';

import HomePage          from './pages/Home';
import ProductListPage   from './pages/ProductList';
import ProductDetailPage from './pages/ProductDetail';
import CartPage          from './pages/Cart';
import CheckoutPage      from './pages/Checkout';
import OrdersPage        from './pages/Orders';
import OrderDetailPage   from './pages/OrderDetail';
import LoginPage         from './pages/Login';
import RegisterPage      from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';

import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts  from './pages/seller/Products';
import AddProduct      from './pages/seller/AddProduct';
import SellerOrders    from './pages/seller/Orders';

import AdminDashboard  from './pages/admin/Dashboard';
import AdminProducts   from './pages/admin/Products';
import AdminOrders     from './pages/admin/Orders';

const Protected = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

// Layout that wraps most pages
function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1111]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  const { token, login } = useAuthStore();

  useEffect(() => {
    if (token) {
      authAPI.getMe()
        .then((r) => login(r.data.user, token))
        .catch(() => useAuthStore.getState().logout());
    }
  }, []);

  return (
    <Routes>
      {/* Auth pages — standalone, NO global Navbar */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* All other pages — wrapped in MainLayout with Navbar + Footer */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/products" element={<MainLayout><ProductListPage /></MainLayout>} />
      <Route path="/products/:slug" element={<MainLayout><ProductDetailPage /></MainLayout>} />
      <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />

      <Route path="/checkout" element={<MainLayout><Protected roles={['buyer']}><CheckoutPage /></Protected></MainLayout>} />
      <Route path="/orders" element={<MainLayout><Protected><OrdersPage /></Protected></MainLayout>} />
      <Route path="/orders/:id" element={<MainLayout><Protected><OrderDetailPage /></Protected></MainLayout>} />

      <Route path="/seller" element={<MainLayout><Protected roles={['seller']}><SellerDashboard /></Protected></MainLayout>} />
      <Route path="/seller/products" element={<MainLayout><Protected roles={['seller']}><SellerProducts /></Protected></MainLayout>} />
      <Route path="/seller/products/add" element={<MainLayout><Protected roles={['seller']}><AddProduct /></Protected></MainLayout>} />
      <Route path="/seller/orders" element={<MainLayout><Protected roles={['seller']}><SellerOrders /></Protected></MainLayout>} />

      <Route path="/admin" element={<MainLayout><Protected roles={['admin']}><AdminDashboard /></Protected></MainLayout>} />
      <Route path="/admin/products" element={<MainLayout><Protected roles={['admin']}><AdminProducts /></Protected></MainLayout>} />
      <Route path="/admin/orders" element={<MainLayout><Protected roles={['admin']}><AdminOrders /></Protected></MainLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

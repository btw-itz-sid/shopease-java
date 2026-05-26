import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col items-center py-8 px-4">
      {/* Logo */}
      <Link to="/" className="mb-6">
        <span className="text-3xl font-black text-[#0F1111] tracking-tight">
          shop<span className="text-[#FF9900]">ease</span>
          <span className="text-[#FF9900] text-base">.in</span>
        </span>
      </Link>

      {/* Login Box */}
      <div className="bg-white w-full max-w-[350px] rounded border border-[#D5D9D9] px-6 py-5 shadow-sm">
        <h1 className="text-[#0F1111] text-2xl font-medium mb-4">Sign in</h1>

        {error && (
          <div className="mb-4 p-3 border border-[#CC0C39] bg-[#FFF5F5] rounded text-[#CC0C39] text-sm">
            <strong>There was a problem:</strong><br />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-[#0F1111] text-sm font-bold mb-1">Email or mobile phone number</label>
            <input
              type="email"
              required
              className="w-full border border-[#A6A6A6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/40 bg-white text-[#0F1111]"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-[#0F1111] text-sm font-bold">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                className="w-full border border-[#A6A6A6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/40 bg-white text-[#0F1111] pr-16"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#007185] hover:text-[#C7511F] text-xs font-bold hover:underline"
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded py-1.5 text-sm font-medium text-[#0F1111] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>

          <p className="mt-3 text-[11px] text-[#565656] leading-relaxed">
            By continuing, you agree to ShopEase's{' '}
            <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">Conditions of Use</a>
            {' '}and{' '}
            <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">Privacy Notice</a>.
          </p>
        </form>

        <div className="mt-5 pt-4 border-t border-[#D5D9D9]">
          <p className="text-xs text-[#0F1111] mb-1 font-bold">New to ShopEase?</p>
          <Link
            to="/register"
            className="block w-full text-center bg-white hover:bg-[#F7F8F8] border border-[#D5D9D9] rounded py-1.5 text-sm text-[#0F1111] transition-colors shadow-sm"
          >
            Create your ShopEase account
          </Link>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-6 flex gap-4 text-xs text-[#007185] flex-wrap justify-center">
        <a href="#" className="hover:text-[#C7511F] hover:underline">Conditions of Use</a>
        <a href="#" className="hover:text-[#C7511F] hover:underline">Privacy Notice</a>
        <a href="#" className="hover:text-[#C7511F] hover:underline">Help</a>
      </div>
      <p className="mt-3 text-xs text-[#767676]">© 2024-2026, ShopEase.in, Inc.</p>
    </div>
  );
}

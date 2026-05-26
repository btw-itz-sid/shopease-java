import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { authAPI } from '../services/api';

export default function RegisterPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Passwords must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col items-center py-8 px-4">
      <Link to="/" className="mb-6">
        <span className="text-3xl font-black text-[#0F1111] tracking-tight">
          shop<span className="text-[#FF9900]">ease</span>
          <span className="text-[#FF9900] text-base">.in</span>
        </span>
      </Link>

      <div className="bg-white w-full max-w-[400px] rounded border border-[#D5D9D9] px-6 py-5 shadow-sm">
        <h1 className="text-[#0F1111] text-2xl font-medium mb-4">Create account</h1>

        {error && (
          <div className="mb-4 p-3 border border-[#CC0C39] bg-[#FFF5F5] rounded text-[#CC0C39] text-sm">
            <strong>There was a problem:</strong><br />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[#0F1111] text-sm font-bold mb-1">Your name</label>
            <input
              type="text" required placeholder="First and last name"
              className="w-full border border-[#A6A6A6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/40 text-[#0F1111]"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[#0F1111] text-sm font-bold mb-1">Email</label>
            <input
              type="email" required
              className="w-full border border-[#A6A6A6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/40 text-[#0F1111]"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[#0F1111] text-sm font-bold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} required placeholder="At least 6 characters"
                className="w-full border border-[#A6A6A6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/40 text-[#0F1111] pr-14"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#007185] hover:text-[#C7511F] text-xs font-bold hover:underline">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Account type */}
          <div>
            <label className="block text-[#0F1111] text-sm font-bold mb-2">I want to</label>
            <div className="flex gap-3">
              {[{ v: 'buyer', l: '🛍️ Shop & Buy' }, { v: 'seller', l: '🏪 Sell Products' }].map(opt => (
                <label key={opt.v} className={`flex-1 cursor-pointer border-2 rounded px-3 py-2 text-center text-sm font-medium transition-colors ${form.role === opt.v ? 'border-[#E77600] bg-[#FEF6E6] text-[#0F1111]' : 'border-[#D5D9D9] text-[#565656] hover:border-[#A6A6A6]'}`}>
                  <input type="radio" name="role" value={opt.v} checked={form.role === opt.v} onChange={() => setForm({ ...form, role: opt.v })} className="sr-only" />
                  {opt.l}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded py-1.5 text-sm font-medium text-[#0F1111] transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? 'Creating account...' : 'Create your ShopEase account'}
          </button>

          <p className="text-[11px] text-[#565656] leading-relaxed">
            By creating an account, you agree to ShopEase's{' '}
            <a href="#" className="text-[#007185] hover:underline">Conditions of Use</a> and{' '}
            <a href="#" className="text-[#007185] hover:underline">Privacy Notice</a>.
          </p>
        </form>

        <div className="mt-5 pt-4 border-t border-[#D5D9D9]">
          <p className="text-sm text-[#0F1111]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#007185] hover:text-[#C7511F] hover:underline font-medium">Sign in →</Link>
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-4 text-xs text-[#007185] flex-wrap justify-center">
        <a href="#" className="hover:underline">Conditions of Use</a>
        <a href="#" className="hover:underline">Privacy Notice</a>
        <a href="#" className="hover:underline">Help</a>
      </div>
      <p className="mt-3 text-xs text-[#767676]">© 2024-2026, ShopEase.in, Inc.</p>
    </div>
  );
}

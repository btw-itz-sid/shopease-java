import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, uploadAPI } from '../../services/api';
import { FiUpload } from 'react-icons/fi';

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', original_price: '', stock: '', category_id: '', images: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productAPI.create({ ...form, price: Number(form.price), stock: Number(form.stock), original_price: form.original_price ? Number(form.original_price) : null });
      navigate('/seller/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-dark-900">
      <div className="container-app py-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">Add New Product</h1>
        {error && <div className="mb-6 p-4 bg-brand-red/10 border border-brand-red/30 rounded-xl text-brand-red text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          {[['title', 'Product Title', 'text', true], ['description', 'Description', 'text', true], ['price', 'Price (₹)', 'number', true], ['original_price', 'Original Price (₹, optional)', 'number', false], ['stock', 'Stock Quantity', 'number', true]].map(([key, label, type, req]) => (
            <div key={key}>
              <label className="text-sm font-semibold text-gray-400 mb-2 block">{label}</label>
              {key === 'description'
                ? <textarea required={req} className="input min-h-[100px]" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                : <input type={type} required={req} className="input" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              }
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <span className="w-5 h-5 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" /> : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

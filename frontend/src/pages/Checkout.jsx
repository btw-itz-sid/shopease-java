import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { orderAPI } from '../services/api';
import { FiMapPin } from 'react-icons/fi';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, tax, deliveryFee, total, clearCart } = useCartStore();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await orderAPI.place({ shipping_address: form });
      clearCart();
      navigate(`/orders/${res.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, placeholder, full = false) => (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-sm font-bold text-[#0F1111] mb-1">{label}</label>
      <input
        required
        placeholder={placeholder}
        className="w-full border border-[#A6A6A6] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/30 text-[#0F1111] bg-white"
        value={form[key]}
        onChange={e => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="bg-[#EAEDED] min-h-screen py-4">
      <div className="max-w-[1100px] mx-auto px-4">
        <h1 className="text-3xl font-medium text-[#0F1111] mb-4">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Address Form */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-4 p-3 border border-[#CC0C39] bg-[#FFF5F5] rounded text-[#CC0C39] text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}
            <div className="bg-white border border-[#D5D9D9] rounded shadow-sm p-6">
              <h2 className="text-[#0F1111] text-xl font-bold mb-5 flex items-center gap-2">
                <FiMapPin className="text-[#FF9900]" /> Shipping Address
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {field('Full Name', 'name', 'John Doe', true)}
                  {field('Phone Number', 'phone', '+91 9999999999')}
                  {field('Pincode', 'pincode', '400001')}
                  {field('Address', 'address', 'Street, Area, Landmark', true)}
                  {field('City', 'city', 'Mumbai')}
                  {field('State', 'state', 'Maharashtra')}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium py-2.5 rounded text-sm mt-2 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Placing order...' : 'Place your order'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-[#D5D9D9] rounded shadow-sm p-5 sticky top-28">
              <h3 className="text-[#0F1111] font-bold text-lg mb-4 border-b border-[#D5D9D9] pb-3">
                Order Summary
              </h3>
              <div className="space-y-2 text-sm text-[#0F1111] mb-4">
                {items.map(item => (
                  <div key={item.product_id} className="flex justify-between">
                    <span className="text-[#565656] flex-1 line-clamp-1 mr-2">{item.title} × {item.quantity}</span>
                    <span className="font-medium shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#D5D9D9] pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-[#0F1111]">
                  <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#0F1111]">
                  <span>Shipping</span>
                  <span className={deliveryFee === 0 ? 'text-[#007600] font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-[#0F1111]">
                  <span>GST est.</span><span>₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-bold text-[#0F1111] text-base border-t border-[#D5D9D9] pt-2 mt-2">
                  <span>Order Total</span>
                  <span className="text-[#B12704]">₹{total.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

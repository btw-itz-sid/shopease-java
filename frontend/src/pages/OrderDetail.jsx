import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { FiPackage, FiMapPin, FiArrowLeft } from 'react-icons/fi';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STATUS_STYLES = {
  pending:    'bg-[#FEF9E7] text-[#B7950B] border border-[#F9E79F]',
  confirmed:  'bg-[#EAF9F0] text-[#1E8449] border border-[#A9DFBF]',
  shipped:    'bg-[#EAF4FB] text-[#1A5276] border border-[#AED6F1]',
  delivered:  'bg-[#EAF9F0] text-[#1E8449] border border-[#A9DFBF]',
  cancelled:  'bg-[#FDEDEC] text-[#922B21] border border-[#F5B7B1]',
  processing: 'bg-[#FEF9E7] text-[#B7950B] border border-[#F9E79F]',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id).then(r => setOrder(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="bg-[#EAEDED] min-h-screen py-6">
      <div className="max-w-[800px] mx-auto px-4">
        <div className="bg-white border border-[#D5D9D9] rounded animate-pulse h-64" />
      </div>
    </div>
  );
  if (!order) return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center text-[#565656]">
      Order not found
    </div>
  );

  const stepIndex = STATUS_STEPS.indexOf(order.status);
  const items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
  const addr = typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address;

  return (
    <div className="bg-[#EAEDED] min-h-screen py-4">
      <div className="max-w-[900px] mx-auto px-4">
        <Link to="/orders" className="flex items-center gap-1.5 text-[#007185] hover:text-[#C7511F] hover:underline text-sm mb-4 transition-colors">
          <FiArrowLeft className="text-xs" /> Back to Your Orders
        </Link>

        <h1 className="text-2xl font-medium text-[#0F1111] mb-1">Order Details</h1>
        <p className="text-sm text-[#565656] mb-4">
          Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          {' · '}Order # {order.id.slice(0, 8).toUpperCase()}
          {' · '}
          <span className={`text-xs font-bold px-2 py-0.5 rounded ml-1 ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
            {order.status?.toUpperCase()}
          </span>
        </p>

        {/* Progress Tracker */}
        {order.status !== 'cancelled' && (
          <div className="bg-white border border-[#D5D9D9] rounded shadow-sm p-6 mb-4">
            <h3 className="text-[#0F1111] font-bold mb-5">Delivery Progress</h3>
            <div className="relative flex items-start justify-between">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#D5D9D9]" />
              <div className="absolute left-0 top-5 h-0.5 bg-[#007600] transition-all" style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }} />
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${i <= stepIndex ? 'bg-[#007600] border-[#007600] text-white' : 'bg-white border-[#D5D9D9] text-[#565656]'}`}>
                    {i < stepIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${i <= stepIndex ? 'text-[#007600]' : 'text-[#565656]'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Items */}
          <div className="lg:col-span-2 bg-white border border-[#D5D9D9] rounded shadow-sm">
            <div className="p-4 border-b border-[#D5D9D9] flex items-center gap-2">
              <FiPackage className="text-[#565656]" />
              <h3 className="font-bold text-[#0F1111]">Items in Your Order</h3>
            </div>
            <div className="divide-y divide-[#D5D9D9]">
              {items.map((item, i) => (
                <div key={i} className="p-4 flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#F3F3F3] rounded border border-[#D5D9D9] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image_url
                      ? <img src={item.image_url} alt={item.title} className="w-full h-full object-contain p-1" />
                      : <FiPackage className="text-[#A6A6A6] text-xl" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0F1111] line-clamp-2">{item.title}</p>
                    <p className="text-xs text-[#565656] mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-[#0F1111] shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-[#D5D9D9] space-y-2 text-sm">
              <div className="flex justify-between text-[#565656]"><span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-[#565656]"><span>Delivery</span><span>{Number(order.delivery_fee) === 0 ? <span className="text-[#007600] font-medium">FREE</span> : `₹${Number(order.delivery_fee)}`}</span></div>
              <div className="flex justify-between text-[#565656]"><span>GST</span><span>₹{Number(order.tax || 0).toFixed(0)}</span></div>
              <div className="flex justify-between font-bold text-[#0F1111] text-base border-t border-[#D5D9D9] pt-2 mt-2">
                <span>Order Total</span><span className="text-[#B12704]">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          {addr && (
            <div className="bg-white border border-[#D5D9D9] rounded shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3 border-b border-[#D5D9D9] pb-3">
                <FiMapPin className="text-[#FF9900]" />
                <h3 className="font-bold text-[#0F1111]">Shipping Address</h3>
              </div>
              <p className="text-sm font-medium text-[#0F1111]">{addr.name}</p>
              <p className="text-sm text-[#565656] mt-1">{addr.address}</p>
              <p className="text-sm text-[#565656]">{addr.city}, {addr.state} - {addr.pincode}</p>
              {addr.phone && <p className="text-sm text-[#565656] mt-1">📞 {addr.phone}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

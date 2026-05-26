import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { FiPackage, FiArrowRight, FiChevronRight } from 'react-icons/fi';

const STATUS_STYLES = {
  pending:   'bg-[#FEF9E7] text-[#B7950B] border border-[#F9E79F]',
  confirmed: 'bg-[#EAF9F0] text-[#1E8449] border border-[#A9DFBF]',
  shipped:   'bg-[#EAF4FB] text-[#1A5276] border border-[#AED6F1]',
  delivered: 'bg-[#EAF9F0] text-[#1E8449] border border-[#A9DFBF]',
  cancelled: 'bg-[#FDEDEC] text-[#922B21] border border-[#F5B7B1]',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll().then(r => setOrders(r.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="bg-[#EAEDED] min-h-screen py-6">
      <div className="max-w-[1000px] mx-auto px-4 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#D5D9D9] rounded animate-pulse h-28" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-[#EAEDED] min-h-screen py-4">
      <div className="max-w-[1000px] mx-auto px-4">
        <h1 className="text-3xl font-medium text-[#0F1111] mb-4">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#D5D9D9] rounded shadow-sm p-10 text-center">
            <FiPackage className="text-6xl text-[#D5D9D9] mx-auto mb-4" />
            <h3 className="text-xl font-medium text-[#0F1111] mb-2">You have no orders</h3>
            <p className="text-[#565656] text-sm mb-5">Looks like you haven't placed any orders yet.</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium px-6 py-2 rounded text-sm transition-colors">
              Start Shopping <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Link to={`/orders/${order.id}`} key={order.id}
                className="bg-white border border-[#D5D9D9] rounded shadow-sm hover:shadow-md hover:border-[#FF9900] transition-all block">
                {/* Order Header */}
                <div className="bg-[#F3F3F3] border-b border-[#D5D9D9] px-5 py-3 flex flex-wrap items-center justify-between gap-3 rounded-t">
                  <div className="flex gap-6 text-xs text-[#565656]">
                    <div>
                      <div className="font-bold text-[#0F1111] uppercase text-[10px] tracking-wide">Order placed</div>
                      <div>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div>
                      <div className="font-bold text-[#0F1111] uppercase text-[10px] tracking-wide">Total</div>
                      <div>₹{Number(order.total_amount).toLocaleString('en-IN')}</div>
                    </div>
                    <div>
                      <div className="font-bold text-[#0F1111] uppercase text-[10px] tracking-wide">Ship to</div>
                      <div className="text-[#007185]">{order.shipping_address?.name || 'You'}</div>
                    </div>
                  </div>
                  <div className="text-xs text-[#565656]">
                    <span className="font-bold text-[#0F1111]">Order # </span>
                    {order.id.slice(0, 8).toUpperCase()}
                  </div>
                </div>

                {/* Order Body */}
                <div className="px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FiPackage className="text-2xl text-[#565656]" />
                    <div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                        {order.status?.toUpperCase()}
                      </span>
                      <p className="text-[#565656] text-xs mt-1">
                        {order.items?.length || 0} item(s) in this order
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#007185] text-sm hover:text-[#C7511F]">
                    View order details <FiChevronRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

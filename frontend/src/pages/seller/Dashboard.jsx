import React from 'react';
import { Link } from 'react-router-dom';
export default function SellerDashboard() {
  return (
    <div className="min-h-screen pt-20 bg-dark-900">
      <div className="container-app py-10">
        <h1 className="text-3xl font-black text-white mb-6">Seller Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[['My Products', '/seller/products', '🛍️'], ['My Orders', '/seller/orders', '📦'], ['Add Product', '/seller/products/add', '➕']].map(([t, to, icon]) => (
            <Link key={t} to={to} className="card p-6 text-center hover:border-brand-orange/40 transition-all">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-white">{t}</h3>
            </Link>
          ))}
        </div>
        <div className="card p-6"><p className="text-gray-400">Full seller analytics dashboard coming soon. Use the links above to manage your store.</p></div>
      </div>
    </div>
  );
}

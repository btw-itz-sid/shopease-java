import React from 'react';
import { Link } from 'react-router-dom';
export default function AdminDashboard() {
  return (
    <div className="min-h-screen pt-20 bg-dark-900">
      <div className="container-app py-10">
        <h1 className="text-3xl font-black text-white mb-6">Admin Panel</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[['All Products', '/admin/products', '🛍️'], ['All Orders', '/admin/orders', '📦'], ['Users', '#', '👥']].map(([t, to, icon]) => (
            <Link key={t} to={to} className="card p-6 text-center hover:border-brand-orange/40 transition-all">
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-bold text-white">{t}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

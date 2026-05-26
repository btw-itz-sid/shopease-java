import React from 'react';
export default function SellerOrders() {
  return (
    <div className="min-h-screen pt-20 bg-dark-900">
      <div className="container-app py-10">
        <h1 className="text-3xl font-black text-white mb-6">Seller Orders</h1>
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-400">Orders for your products will appear here.</p>
        </div>
      </div>
    </div>
  );
}

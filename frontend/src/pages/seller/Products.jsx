import React from 'react';
import { Link } from 'react-router-dom';
export default function SellerProducts() {
  return (
    <div className="min-h-screen pt-20 bg-dark-900">
      <div className="container-app py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-white">My Products</h1>
          <Link to="/seller/products/add" className="btn-primary">+ Add Product</Link>
        </div>
        <div className="card p-8 text-center">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-gray-400">You haven't added any products yet.</p>
          <Link to="/seller/products/add" className="btn-primary inline-block mt-4">Add Your First Product</Link>
        </div>
      </div>
    </div>
  );
}

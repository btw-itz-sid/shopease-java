import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, ShieldAlert, Award } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const [isHovered, setIsHovered] = useState(false);
  const images = JSON.parse(product.images);
  const displayImage = images[0] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80";

  // Compute stock state indicators
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-600/5 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border-b border-slate-900 flex items-center justify-center">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Subtle dynamic overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5">
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white hover:bg-white/20 transition-all active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 border border-violet-500 text-[10px] font-bold text-white hover:bg-violet-500 transition-all active:scale-95 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Floating Category Tag */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wide uppercase bg-slate-950/80 border border-slate-800 backdrop-blur-sm text-slate-300">
          {product.category?.name}
        </span>

        {/* Stock Level Badges */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-rose-500/25 border border-rose-500/40 text-rose-400 backdrop-blur-sm">
            <ShieldAlert className="w-2.5 h-2.5" />
            <span>OUT OF STOCK</span>
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-500/20 border border-amber-500/30 text-amber-400 backdrop-blur-sm animate-pulse">
            <span>ONLY {product.stock} LEFT</span>
          </span>
        ) : null}
      </div>

      {/* Details Container */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Ratings & Seller ID */}
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-200">{product.rating.toFixed(2)}</span>
              <span>({product.ratingCount})</span>
            </div>
            <div className="flex items-center gap-0.5">
              <Award className="w-3 h-3 text-indigo-400" />
              <span>Seller: {product.seller?.name}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-100 group-hover:text-violet-400 transition-colors text-xs sm:text-sm line-clamp-1 leading-snug tracking-tight">
            {product.title}
          </h3>

          {/* Description Snippet */}
          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pricing and Action row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-900 mt-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">JPA Price Numeric</span>
            <span className="text-sm sm:text-base font-extrabold text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={() => onQuickView(product)}
            className="text-[10px] font-bold text-violet-400 hover:text-violet-300 transition-all flex items-center gap-1"
          >
            <span>Inspect Entity</span>
            <span className="text-slate-500 font-mono text-[9px]">➜</span>
          </button>
        </div>
      </div>
    </div>
  );
}

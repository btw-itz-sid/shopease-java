import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const images = JSON.parse(product.images);
  const displayImage = images[0];
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 15;

  return (
    <div className="group relative bg-white border border-[#E7E5E4] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F0EA]">
        <img src={displayImage} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" loading="lazy" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Action buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
          <button onClick={() => onQuickView(product)}
            className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-[#1C1917] hover:bg-white active:scale-95 transition-all">
            Quick View
          </button>
          <button onClick={() => onAddToCart(product)} disabled={isOutOfStock}
            className="px-4 py-2 rounded-full bg-[#1C1917] text-[11px] font-semibold text-white hover:bg-[#292524] active:scale-95 transition-all disabled:bg-[#A8A29E] disabled:text-white">
            Add to Cart
          </button>
        </div>

        {/* Wishlist */}
        <button onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white">
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isWishlisted ? '#B91C1C' : 'none'} stroke={isWishlisted ? '#B91C1C' : '#44403C'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* Category */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-white/85 backdrop-blur-sm text-[#44403C]">
          {product.category?.name}
        </span>

        {/* Stock badges */}
        {isOutOfStock ? (
          <span className="absolute bottom-3 left-3 group-hover:bottom-16 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 transition-all">Sold Out</span>
        ) : isLowStock ? (
          <span className="absolute bottom-3 left-3 group-hover:bottom-16 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 transition-all">Only {product.stock} left</span>
        ) : null}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#D97706"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            <span className="font-semibold text-[#1C1917]">{product.rating.toFixed(1)}</span>
            <span className="text-[#A8A29E]">({product.ratingCount})</span>
          </div>
          <span className="text-[#A8A29E] truncate max-w-[120px]">{product.seller?.name}</span>
        </div>

        <h3 className="text-[13px] font-semibold text-[#1C1917] leading-snug line-clamp-1">{product.title}</h3>
        <p className="text-[11px] text-[#A8A29E] leading-relaxed line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between pt-2.5 border-t border-[#F3F0EA]">
          <span className="text-lg font-bold text-[#1C1917]">${product.price.toFixed(2)}</span>
          <button onClick={() => onQuickView(product)} className="text-[11px] font-medium text-[#4A6741] hover:text-[#3D5636] transition-colors">View Details →</button>
        </div>
      </div>
    </div>
  );
}

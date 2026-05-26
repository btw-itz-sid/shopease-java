import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';

const PLACEHOLDER = 'https://placehold.co/300x300/232F3E/FF9900?text=ShopEase';

export default function ProductCard({ product }) {
  const images = product.images?.length ? product.images : [PLACEHOLDER];
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;
  const rating = Number(product.rating || 4.2);
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;

  return (
    <Link to={`/products/${product.id}`} className="block bg-white rounded border border-transparent hover:border-[#FF9900] hover:shadow-md transition-all group overflow-hidden">
      {/* Image */}
      <div className="relative bg-white flex items-center justify-center" style={{ aspectRatio: '1/1' }}>
        <img
          src={images[0]}
          alt={product.title}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {discount && (
          <div className="absolute top-2 left-2 bg-[#CC0C39] text-white text-[11px] font-black px-1.5 py-0.5 rounded-sm">
            -{discount}%
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 right-2 bg-[#FF9900] text-black text-[11px] font-black px-1.5 py-0.5 rounded-sm">
            #1 Best Seller
          </div>
        )}
      </div>

      {/* Details */}
      <div className="px-3 py-2 border-t border-gray-100">
        <h3 className="text-[#0F1111] text-sm leading-snug line-clamp-2 min-h-[36px] group-hover:text-[#C7511F] transition-colors">
          {product.title}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-[#FF9900]">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill={i < fullStars ? 'currentColor' : i === fullStars && halfStar ? 'url(#half)' : 'none'} stroke="currentColor" strokeWidth="1">
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="#FF9900" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <polygon points="10,2 12.5,7.5 18,8 14,12 15.5,18 10,15 4.5,18 6,12 2,8 7.5,7.5" />
              </svg>
            ))}
          </div>
          <span className="text-[#007185] text-xs hover:text-[#C7511F]">{rating.toFixed(1)}</span>
        </div>

        {/* Price */}
        <div className="mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px] text-[#565656] align-top mt-0.5">₹</span>
            <span className="text-[#0F1111] text-2xl font-medium leading-none">
              {Number(product.price).toLocaleString('en-IN').split('.')[0]}
            </span>
          </div>
          {product.original_price && (
            <div className="flex items-center gap-1.5 text-xs text-[#565656] mt-0.5">
              <span>M.R.P.:</span>
              <span className="line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
              {discount && <span className="text-[#CC0C39]">({discount}% off)</span>}
            </div>
          )}
        </div>

        {/* Stock / Delivery */}
        <div className="mt-2 text-xs">
          {product.stock > 0 ? (
            <span className="text-[#007600] font-medium">In stock</span>
          ) : (
            <span className="text-[#CC0C39] font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}

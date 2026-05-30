import React, { useState } from 'react';

export default function EntityDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  const images = JSON.parse(product.images);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative w-full max-w-3xl bg-white border border-[#E7E5E4] rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col animate-scaleIn">
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 w-9 h-9 rounded-full bg-[#F3F0EA] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] transition-all z-20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F3F0EA] border border-[#E7E5E4]">
                <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage(i => i > 0 ? i - 1 : images.length - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#44403C] hover:bg-white transition-all shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button onClick={() => setActiveImage(i => i < images.length - 1 ? i + 1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#44403C] hover:bg-white transition-all shadow-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-[#4A6741]' : 'border-[#E7E5E4] opacity-50 hover:opacity-80'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold bg-[#F3F0EA] text-[#4A6741] border border-[#E7E5E4] uppercase tracking-wider">
                  {product.category?.name}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] leading-tight tracking-tight">{product.title}</h2>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? '#D97706' : '#E7E5E4'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    <span className="ml-1 font-semibold text-[#1C1917]">{product.rating.toFixed(1)}</span>
                    <span className="text-[#A8A29E]">({product.ratingCount} reviews)</span>
                  </div>
                </div>

                <p className="text-sm text-[#78716C] leading-relaxed">{product.description}</p>

                <div>
                  <p className="text-xs text-[#A8A29E] mb-1">by <span className="text-[#44403C] font-medium">{product.seller?.name}</span></p>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1C1917]">${product.price.toFixed(2)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#78716C]">Qty:</span>
                  <div className="flex items-center border border-[#E7E5E4] rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3F0EA] transition-all text-lg">−</button>
                    <span className="w-10 text-center text-sm font-semibold text-[#1C1917]">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3F0EA] transition-all text-lg">+</button>
                  </div>
                  {product.stock > 0 && <span className="text-[11px] text-[#A8A29E]">{product.stock} in stock</span>}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#E7E5E4]">
                <div className="flex gap-3">
                  <button
                    onClick={() => { for (let i = 0; i < quantity; i++) onAddToCart(product); onClose(); }}
                    disabled={isOutOfStock}
                    className="flex-1 py-3.5 rounded-full bg-[#1C1917] text-white text-sm font-semibold hover:bg-[#292524] transition-all disabled:bg-[#D6D3CE] disabled:text-[#A8A29E] active:scale-[0.98]">
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button className="w-12 h-12 rounded-full border border-[#E7E5E4] flex items-center justify-center text-[#78716C] hover:text-red-600 hover:border-red-200 transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-5 text-[11px] text-[#A8A29E]">
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Secure Payment
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    Free Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

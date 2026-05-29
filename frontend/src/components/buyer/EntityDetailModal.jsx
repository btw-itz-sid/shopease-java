import React from 'react';
import { X, Server, Database, Layers, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function EntityDetailModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const images = JSON.parse(product.images);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-950/60 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
            <Layers className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">Active Entity Inspector</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">com.shopease.model.Product @{product.id}</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main info row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carousel / Image container */}
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img 
                  src={images[0]} 
                  alt={product.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Image list thumbnails if multiple exist */}
              {images.length > 1 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-800">
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Entity metadata */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  PERSISTENT ENTITY
                </span>
                <h4 className="font-bold text-white text-lg leading-tight tracking-tight">{product.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <span>Category:</span>
                  <span className="text-violet-400 underline">{product.category.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <span>Seller:</span>
                  <span className="text-pink-450 font-bold">{product.seller?.name} ({product.seller?.role})</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-2">{product.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">JPA BigDecimal Price</span>
                  <span className="text-xl font-extrabold text-white">${product.price.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-xs font-bold text-white flex items-center gap-2 transition-all shadow-lg shadow-violet-600/10 disabled:bg-slate-800 disabled:text-slate-500"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Mock Item</span>
                </button>
              </div>
            </div>
          </div>

          {/* Database JSON representation */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-mono">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Serialized PostgreSQL Row (JSON)</span>
            </h4>
            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-xl text-[10px] sm:text-xs font-mono text-indigo-300 overflow-x-auto border border-slate-850 max-h-[220px]">
                {JSON.stringify(
                  {
                    id: product.id,
                    title: product.title,
                    slug: product.slug,
                    description: product.description,
                    price: parseFloat(product.price),
                    stock: product.stock,
                    rating: parseFloat(product.rating),
                    rating_count: product.ratingCount,
                    is_active: product.isActive,
                    seller: {
                      id: product.seller?.id,
                      name: product.seller?.name,
                      email: product.seller?.email,
                      role: product.seller?.role
                    },
                    category_id: product.category.id,
                    images: images
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>

          {/* JPA Relation Mappings Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <Server className="w-3.5 h-3.5 text-violet-400" />
                <span>Relationship Mapping</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <code>@ManyToOne(fetch = FetchType.LAZY)</code> mapping linking the Product directly to the Category entity. Lazy fetching improves database performance.
              </p>
            </div>
            
            <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
              <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hibernate Validation</span>
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Fields mapped with <code>nullable = false</code> and <code>unique = true</code> columns directly mapping database constraints inside PostgreSQL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

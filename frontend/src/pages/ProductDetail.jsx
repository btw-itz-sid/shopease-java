import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../services/api';
import { useCartStore } from '../store/useCartStore';
import { FiShield, FiTruck, FiRefreshCw, FiStar, FiPlus, FiMinus } from 'react-icons/fi';

const PLACEHOLDER = 'https://placehold.co/400x400/232F3E/FF9900?text=ShopEase';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    productAPI.getBySlug(slug)
      .then(r => {
        const p = r.data.data;
        setProduct(p);
        if (p?.id) reviewAPI.getByProduct(p.id).then(rv => setReviews(rv.data.data || [])).catch(() => {});
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="bg-[#EAEDED] min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!product) return null;

  const images = product.images?.length ? product.images : [PLACEHOLDER];
  const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : null;
  const rating = Number(product.rating || 4.2);

  return (
    <div className="bg-[#EAEDED] min-h-screen py-4">
      <div className="max-w-[1500px] mx-auto px-4">

        {/* Breadcrumb */}
        <nav className="text-xs text-[#007185] mb-4 flex gap-1 items-center flex-wrap">
          <Link to="/" className="hover:text-[#C7511F] hover:underline">Home</Link>
          <span className="text-[#565656]">›</span>
          {product.category_name && <>
            <Link to={`/products?cat=${product.category_slug}`} className="hover:text-[#C7511F] hover:underline">{product.category_name}</Link>
            <span className="text-[#565656]">›</span>
          </>}
          <span className="text-[#565656] line-clamp-1">{product.title}</span>
        </nav>

        <div className="bg-white rounded border border-[#D5D9D9] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">

            {/* ── Left: Images ───────────────────────────────── */}
            <div className="md:col-span-5 p-6 border-r border-[#D5D9D9]">
              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex flex-col gap-2 float-left mr-3 w-14">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-14 h-14 border-2 rounded overflow-hidden transition-all ${i === activeImg ? 'border-[#E77600]' : 'border-[#D5D9D9] opacity-70 hover:opacity-100 hover:border-[#E77600]'}`}>
                      <img src={img} alt="" className="w-full h-full object-contain p-1" onError={e => { e.target.src = PLACEHOLDER; }} />
                    </button>
                  ))}
                </div>
              )}
              {/* Main Image */}
              <div className="flex items-center justify-center" style={{ minHeight: '380px' }}>
                <img
                  src={images[activeImg]}
                  alt={product.title}
                  className="max-h-[380px] max-w-full object-contain"
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
              </div>
              <div className="clear-both" />
            </div>

            {/* ── Center: Product Info ─────────────────────── */}
            <div className="md:col-span-5 p-6 border-r border-[#D5D9D9]">
              <h1 className="text-[#0F1111] text-xl font-medium leading-snug mb-2">
                {product.title}
              </h1>

              {/* Brand */}
              <p className="text-[#007185] text-sm mb-3 hover:text-[#C7511F] hover:underline cursor-pointer">
                Brand: {product.category_name || 'ShopEase'}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#D5D9D9]">
                <div className="flex text-[#FF9900]">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FiStar key={i} className={`text-sm ${i < Math.round(rating) ? 'fill-[#FF9900]' : 'text-[#DDD]'}`} />
                  ))}
                </div>
                <span className="text-[#007185] text-sm hover:text-[#C7511F] cursor-pointer hover:underline">
                  {rating.toFixed(1)} · {reviews.length} ratings
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                {discount && (
                  <span className="text-[#CC0C39] text-sm font-bold">{discount}% off</span>
                )}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-[#565656] text-sm">-{discount || ''}%</span>
                  <span className="text-[#B12704] text-3xl font-medium">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                </div>
                {product.original_price && (
                  <div className="text-[#565656] text-sm mt-1">
                    M.R.P.:{' '}
                    <span className="line-through">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <p className="text-[#565656] text-xs mt-1">Inclusive of all taxes</p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="text-[#0F1111] font-bold mb-2 text-sm">About this item</h3>
                <p className="text-[#0F1111] text-sm leading-relaxed">{product.description}</p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#D5D9D9]">
                {[
                  { Icon: FiTruck, label: 'Free Delivery', sub: 'On orders ₹499+' },
                  { Icon: FiRefreshCw, label: '10 Day Returns', sub: 'Easy returns' },
                  { Icon: FiShield, label: '1 Year Warranty', sub: 'Brand warranty' },
                ].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <Icon className="text-[#565656] text-xl" />
                    <span className="text-[#0F1111] text-xs font-medium">{label}</span>
                    <span className="text-[#565656] text-[10px]">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Buy Box (Amazon style) ───────────── */}
            <div className="md:col-span-2 p-5">
              <div className="border border-[#D5D9D9] rounded p-4">
                <div className="text-[#B12704] text-2xl font-medium mb-1">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </div>
                <p className="text-[#007600] text-sm font-medium mb-1">
                  {product.stock > 0 ? 'In stock' : 'Currently unavailable'}
                </p>
                <p className="text-[#565656] text-xs mb-3">Eligible for FREE Delivery</p>

                {/* Quantity */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#0F1111] text-sm font-medium">Qty:</span>
                  <div className="flex items-center border border-[#D5D9D9] rounded overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2 py-1 bg-[#F3F3F3] hover:bg-[#E9E9E9] text-[#0F1111] border-r border-[#D5D9D9]">
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="px-3 py-1 text-sm font-bold text-[#0F1111]">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={product.stock === 0} className="px-2 py-1 bg-[#F3F3F3] hover:bg-[#E9E9E9] text-[#0F1111] border-l border-[#D5D9D9] disabled:opacity-40">
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                </div>

                <button
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className={`w-full py-2 rounded-full text-sm font-medium mb-2 transition-all ${added ? 'bg-[#007600] text-white' : 'bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111]'} disabled:opacity-50`}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
                <button
                  disabled={product.stock === 0}
                  className="w-full py-2 bg-[#FF9900] hover:bg-[#F0A000] text-white rounded-full text-sm font-medium border border-[#E77600] disabled:opacity-50"
                >
                  Buy Now
                </button>

                <div className="mt-4 text-xs text-[#565656] space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#0F1111]">Ships from</span>
                    <span>ShopEase</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-[#0F1111]">Sold by</span>
                    <span>ShopEase</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-[#0F1111]">Returns</span>
                    <span>Eligible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="bg-white mt-4 rounded border border-[#D5D9D9] shadow-sm p-6">
            <h2 className="text-[#0F1111] text-2xl font-medium mb-4">
              Customer reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-[#D5D9D9] pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#232F3E] text-white flex items-center justify-center text-sm font-bold">
                      {r.buyer_name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <span className="text-sm font-bold text-[#0F1111]">{r.buyer_name || 'Amazon Customer'}</span>
                  </div>
                  <div className="flex text-[#FF9900] text-xs mb-1">
                    {Array.from({ length: 5 }, (_, i) => <FiStar key={i} className={i < r.rating ? 'fill-[#FF9900]' : 'text-[#DDD]'} />)}
                  </div>
                  {r.comment && <p className="text-[#0F1111] text-sm leading-relaxed">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

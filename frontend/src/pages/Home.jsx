import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiZap } from 'react-icons/fi';

/* ─────────────────────────────────────────────────────────────────
   UNIQUE HERO — Cinematic "Split Screen" Product Reveal 
   Left: Bold editorial typography + CTA
   Right: Rotating animated product spotlight
   Background: Dark mesh gradient with animated aurora glow
───────────────────────────────────────────────────────────────── */

const HERO_PRODUCTS = [
  {
    label: 'NEW DROP',
    category: 'Electronics',
    name: 'Sony WH-1000XM5',
    subtitle: 'Industry-leading noise cancellation',
    price: '₹29,990',
    original: '₹34,990',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    accent: '#E50914',
    link: '/products?search=headphones',
  },
  {
    label: 'TRENDING',
    category: 'Fashion',
    name: 'Premium Minimalist Watch',
    subtitle: 'Timeless design. Precision movement.',
    price: '₹4,999',
    original: '₹9,999',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
    accent: '#FF9900',
    link: '/products?search=watch',
  },
  {
    label: 'BESTSELLER',
    category: 'Tech',
    name: 'Mechanical Keyboard',
    subtitle: 'RGB backlit. Tactile feedback.',
    price: '₹6,499',
    original: '₹11,000',
    img: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=600&auto=format&fit=crop',
    accent: '#00D4FF',
    link: '/products?search=keyboard',
  },
];

function UniqueHero() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  const switchSlide = (next) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(next);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      switchSlide((active + 1) % HERO_PRODUCTS.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  const slide = HERO_PRODUCTS[active];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '92vh', background: '#0A0A0A' }}>
      
      {/* ── Animated Aurora Background ─────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main aurora blob */}
        <div
          className="absolute rounded-full blur-[120px] opacity-25 transition-all duration-[2000ms]"
          style={{
            width: '700px', height: '700px',
            background: slide.accent,
            top: '-150px', right: '-100px',
          }}
        />
        {/* Secondary glow */}
        <div
          className="absolute rounded-full blur-[160px] opacity-10"
          style={{
            width: '500px', height: '500px',
            background: '#FF9900',
            bottom: '-100px', left: '-50px',
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center min-h-[92vh] gap-8 py-16">

        {/* LEFT: Typography */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">
          {/* Category Chip */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 w-fit transition-all duration-500"
            style={{ border: `1px solid ${slide.accent}40`, color: slide.accent, background: `${slide.accent}15` }}
          >
            <FiZap className="text-[10px]" />
            {slide.label} · {slide.category}
          </div>

          {/* Giant Headline */}
          <h1
            className={`font-black leading-[0.9] tracking-tight mb-6 transition-all duration-400 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: '#FFFFFF' }}
          >
            {slide.name.split(' ').map((word, i) => (
              <span key={i} className="block" style={{ color: i === 0 ? '#FFFFFF' : i === 1 ? slide.accent : '#FFFFFF' }}>
                {word}
              </span>
            ))}
          </h1>

          <p
            className={`text-[#888] text-lg md:text-xl mb-8 leading-relaxed transition-all duration-400 delay-75 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
          >
            {slide.subtitle}
          </p>

          {/* Price Display */}
          <div
            className={`flex items-baseline gap-3 mb-8 transition-all duration-400 delay-100 ${animating ? 'opacity-0' : 'opacity-100'}`}
          >
            <span className="text-white font-black text-4xl">{slide.price}</span>
            <span className="text-[#555] text-lg line-through">{slide.original}</span>
            <span className="text-[#22C55E] text-sm font-bold px-2 py-0.5 rounded" style={{ background: '#22C55E15' }}>
              SAVE{' '}{Math.round((1 - parseInt(slide.price.replace(/[^0-9]/g, '')) / parseInt(slide.original.replace(/[^0-9]/g, ''))) * 100)}%
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link
              to={slide.link}
              className="inline-flex items-center gap-2 px-7 py-4 rounded font-black text-base transition-all hover:gap-3"
              style={{ background: slide.accent, color: '#fff' }}
            >
              Shop Now <FiArrowRight />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-4 rounded font-black text-base text-white transition-all hover:bg-white/10"
              style={{ border: '1px solid #333' }}
            >
              Explore All
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-2 mt-10">
            {HERO_PRODUCTS.map((p, i) => (
              <button
                key={i}
                onClick={() => switchSlide(i)}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? '32px' : '8px',
                  background: i === active ? slide.accent : '#333',
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Product Spotlight */}
        <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: '500px' }}>
          {/* Outer glow ring */}
          <div
            className="absolute rounded-full transition-all duration-1000"
            style={{
              width: '420px', height: '420px',
              border: `1px solid ${slide.accent}30`,
              boxShadow: `0 0 80px ${slide.accent}20, inset 0 0 80px ${slide.accent}10`,
            }}
          />
          {/* Inner ring */}
          <div
            className="absolute rounded-full transition-all duration-1000"
            style={{
              width: '320px', height: '320px',
              border: `1px solid ${slide.accent}20`,
            }}
          />

          {/* Product Image Stage */}
          <div
            className={`relative z-10 transition-all duration-400 ${animating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
            style={{ width: '340px', height: '340px' }}
          >
            <div
              className="w-full h-full rounded-2xl overflow-hidden"
              style={{
                background: '#111',
                border: `1px solid ${slide.accent}30`,
                boxShadow: `0 32px 80px rgba(0,0,0,0.8), 0 0 40px ${slide.accent}20`,
              }}
            >
              <img
                src={slide.img}
                alt={slide.name}
                className="w-full h-full object-cover"
              />
              {/* Inner gradient */}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${slide.accent}10, transparent 60%)` }}
              />
            </div>

            {/* Floating badge */}
            <div
              className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-black text-white"
              style={{ background: slide.accent, boxShadow: `0 4px 20px ${slide.accent}60` }}
            >
              {slide.label}
            </div>
          </div>

          {/* Nav Arrows */}
          <button
            onClick={() => switchSlide((active - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length)}
            className="absolute left-0 w-10 h-10 rounded-full border border-[#333] bg-black/60 hover:bg-black/90 flex items-center justify-center transition-all text-white"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => switchSlide((active + 1) % HERO_PRODUCTS.length)}
            className="absolute right-0 w-10 h-10 rounded-full border border-[#333] bg-black/60 hover:bg-black/90 flex items-center justify-center transition-all text-white"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #EAEDED)' }}
      />
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PRODUCT ROW — Netflix-style horizontal scroll rack
───────────────────────────────────────────────────────────────── */
function ProductRow({ title, products, loading, link }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

  return (
    <div className="bg-white rounded border border-[#D5D9D9] shadow-sm p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#0F1111] text-xl font-bold">{title}</h2>
        <Link to={link || '/products'} className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm font-medium">
          See all →
        </Link>
      </div>
      <div className="relative">
        <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-16 bg-white/90 hover:bg-white shadow-md rounded-r border border-[#D5D9D9] flex items-center justify-center -ml-4">
          <FiChevronLeft className="text-[#0F1111]" />
        </button>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="flex-shrink-0 w-44 h-60 bg-[#F3F3F3] rounded animate-pulse" />)
            : products.map(p => (
                <div key={p.id} className="flex-shrink-0 w-44">
                  <ProductCard product={p} />
                </div>
              ))}
        </div>
        <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-16 bg-white/90 hover:bg-white shadow-md rounded-l border border-[#D5D9D9] flex items-center justify-center -mr-4">
          <FiChevronRight className="text-[#0F1111]" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CATEGORY CARDS — Netflix-style dark editorial panels
───────────────────────────────────────────────────────────────── */
const CATS = [
  { name: 'Electronics', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=500&auto=format&fit=crop', link: '/products?search=electronics' },
  { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&auto=format&fit=crop', link: '/products?search=fashion' },
  { name: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=500&auto=format&fit=crop', link: '/products?search=home' },
  { name: 'Books', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=500&auto=format&fit=crop', link: '/products?search=books' },
  { name: 'Mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop', link: '/products?search=mobile' },
  { name: 'Sports', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500&auto=format&fit=crop', link: '/products?search=sports' },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN HOME EXPORT
───────────────────────────────────────────────────────────────── */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ limit: 16 }),
      productAPI.getAll({ featured: true, limit: 12 }),
    ]).then(([pRes, fRes]) => {
      setProducts(pRes.data.data || []);
      setFeatured(fRes.data.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ── Unique Dark Hero ─────────────────────────────── */}
      <UniqueHero />

      {/* ── Amazon-style Content Below ───────────────────── */}
      <div className="bg-[#EAEDED]">
        <div className="max-w-[1400px] mx-auto px-4 py-4">

          {/* Category Grid — Netflix dark card style */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[#0F1111] text-xl font-bold">Shop by Category</h2>
              <Link to="/products" className="text-[#007185] hover:text-[#C7511F] hover:underline text-sm">See all departments →</Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATS.map(cat => (
                <Link key={cat.name} to={cat.link}
                  className="group relative rounded overflow-hidden bg-[#232F3E] border border-[#37475A] hover:border-[#FF9900] transition-all shadow">
                  <div className="aspect-square overflow-hidden">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-white text-xs font-bold drop-shadow-lg">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Deal Strip */}
          <div className="bg-[#232F3E] rounded border border-[#37475A] p-4 mb-4 flex items-center justify-between">
            <div>
              <span className="text-[#FF9900] font-black text-xs uppercase tracking-widest block">⚡ Today's Deals</span>
              <span className="text-white text-xl font-bold">Up to 70% off on Top Brands</span>
            </div>
            <Link to="/products" className="bg-[#FF9900] hover:bg-[#F0A000] text-black font-bold px-5 py-2 rounded text-sm transition-colors shrink-0 ml-4">
              See All Deals
            </Link>
          </div>

          {/* Product Rows */}
          <ProductRow title="⭐ Featured Products" products={featured} loading={loading} link="/products?featured=true" />
          <ProductRow title="🔥 New Arrivals" products={products} loading={loading} link="/products?sort=newest" />
          <ProductRow title="💎 Top Picks for You" products={[...products].reverse()} loading={loading} link="/products" />
        </div>
      </div>
    </div>
  );
}

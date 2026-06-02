import React, { useState, useEffect, useRef } from 'react';
import JPAVisualizer from './components/buyer/JPAVisualizer';
import SecurityVisualizer from './components/buyer/SecurityVisualizer';
import CategoryShowcase from './components/buyer/CategoryShowcase';
import ProductCard from './components/buyer/ProductCard';
import EntityDetailModal from './components/buyer/EntityDetailModal';
import AuthModal from './components/buyer/AuthModal';
import { mockCategories, mockProducts } from './utils/mockData';


/* ─── Scroll-reveal ─── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${delay ? `reveal-delay-${delay}` : ''} ${className}`}>{children}</div>;
}

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = Math.ceil(target / 40);
        const id = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(id); }
          else setCount(start);
        }, 30);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Rotating text ─── */
function RotatingText({ words }) {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIdx(i => (i + 1) % words.length); setShow(true); }, 400);
    }, 3000);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className={`inline-block transition-all duration-400 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      {words[idx]}
    </span>
  );
}

/* ─── SVG Icons ─── */
const I = {
  logo: <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="#1C1917"/><path d="M10 22V12l6 4.5L22 12v10" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 12l6-4 6 4" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".35"/></svg>,
  cart: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  search: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  user: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  heart: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  truck: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  shield: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
  refresh: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  headphones: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z"/></svg>,
  star: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  arrow: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>,
  code: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  check: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  menu: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 8h16M4 16h16"/></svg>,
  instagram: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  twitter: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  github: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>,
  play: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
};

/* ─── Promo Banner ─── */
function PromoBanner() {
  const items = ['Summer Sale — Up to 40% Off','Free Shipping Over $99','New Arrivals Weekly','30-Day Returns','Premium Quality'];
  const doubled = [...items, ...items];
  return (
    <div className="bg-[#1C1917] overflow-hidden py-2">
      <div className="marquee-track">
        {doubled.map((t, i) => (
          <span key={i} className="text-[#D6D3CE] text-[11px] tracking-wide whitespace-nowrap mx-12 font-medium">{t}<span className="mx-8 text-[#57534E]">✦</span></span>
        ))}
      </div>
    </div>
  );
}

/* ═══ App ═══ */
export default function App() {
  const [viewMode, setViewMode] = useState('store');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(1200);
  const [sortOption, setSortOption] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [devOpen, setDevOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Authentication & Session States
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check local storage for session
    const storedUser = localStorage.getItem('shopease_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('shopease_user');
      }
    }

    // Health check the backend on load
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8085/api/auth/hash-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'ping' })
        });
        if (response.ok || response.status === 400) {
          setBackendStatus('live');
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    checkBackend();
  }, []);

  const handleAuthSuccess = (user, message) => {
    setCurrentUser(user);
    localStorage.setItem('shopease_user', JSON.stringify(user));
    setToast(message || 'Success!');
    setTimeout(() => setToast(null), 2500);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('shopease_user');
    setUserDropdownOpen(false);
    setToast('Signed out successfully');
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);


  const addToCart = (p) => {
    setCartItems(prev => [...prev, p]);
    setToast(`${p.title} added to cart`);
    setTimeout(() => setToast(null), 2500);
  };

  const filtered = mockProducts.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    let matchCat = true;
    if (selectedCategory) matchCat = p.category.id === selectedCategory.id || (p.category.parent?.id === selectedCategory.id);
    return matchQ && matchCat && p.price <= priceRange;
  }).sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return b.id - a.id;
  });

  /* Dev view */
  if (viewMode === 'jpa' || viewMode === 'security') {
    return (
      <div className="min-h-screen bg-[#FAF8F4] text-[#1C1917] font-sans antialiased">
        <header className="border-b border-[#E7E5E4] bg-white sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">{I.logo}<span className="text-[15px] font-bold tracking-tight">ShopEase</span><span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-widest">Dev</span></div>
            <button onClick={() => setViewMode('store')} className="px-4 py-2 rounded-lg text-xs font-medium text-[#57534E] hover:text-[#1C1917] bg-[#F3F0EA] hover:bg-[#E7E5E4] transition-all">← Back to Store</button>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex gap-2 mb-6">
            {['jpa','security'].map(m => (
              <button key={m} onClick={() => setViewMode(m)} className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode===m?'bg-[#1C1917] text-white':'bg-[#F3F0EA] text-[#57534E] hover:text-[#1C1917]'}`}>
                {m==='jpa'?'📐 Data Architecture':'🔒 Security Lab'}
              </button>
            ))}
          </div>
          {viewMode === 'jpa' ? <JPAVisualizer /> : <SecurityVisualizer />}
        </div>
      </div>
    );
  }

  /* ═══ STORE ═══ */
  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans antialiased selection:bg-[#4A6741]/15">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-fadeInUp">
          <div className="bg-white border border-[#E7E5E4] pl-4 pr-5 py-3 rounded-xl shadow-lg shadow-black/5 flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#4A6741] flex items-center justify-center text-white">{I.check}</span>
            <span className="text-[13px] text-[#1C1917] font-medium">{toast}</span>
          </div>
        </div>
      )}

      {/* Dev toggle */}
      <button onClick={() => setDevOpen(!devOpen)} className="fixed bottom-4 left-4 z-[100] w-8 h-8 rounded-lg bg-white border border-[#E7E5E4] shadow-sm flex items-center justify-center text-[#A8A29E] hover:text-[#1C1917] transition-all" title="Dev Console">{I.code}</button>
      {devOpen && (
        <div className="fixed bottom-14 left-4 z-[100] bg-white border border-[#E7E5E4] rounded-xl p-2 shadow-xl w-48 animate-scaleIn">
          <p className="text-[8px] text-[#A8A29E] uppercase tracking-[0.15em] font-bold mb-1.5 px-2 pt-1">Developer</p>
          {[{m:'jpa',l:'Data Architecture'},{m:'security',l:'Security Lab'}].map(({m,l})=>(
            <button key={m} onClick={()=>{setViewMode(m);setDevOpen(false);}} className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3F0EA] transition-all">{l}</button>
          ))}
        </div>
      )}

      {/* ═══ MARQUEE ═══ */}
      <PromoBanner />

      {/* ═══ NAVBAR ═══ */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-[#E7E5E4]/60' : 'bg-[#FAF8F4]'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="h-16 flex items-center justify-between gap-6">

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 flex-shrink-0">
              {I.logo}
              <span className="text-[18px] font-bold tracking-tight text-[#1C1917]">ShopEase</span>
            </a>

            {/* Nav links */}
            <nav className="hidden lg:flex items-center gap-1">
              {['Home', 'Shop', 'Categories', 'Deals'].map(item => (
                <a key={item} href={item === 'Shop' ? '#products' : item === 'Categories' ? '#categories' : '#'} className="relative px-4 py-2 text-[13px] font-medium text-[#57534E] hover:text-[#1C1917] transition-colors rounded-lg hover:bg-[#F3F0EA]/60">
                  {item}
                </a>
              ))}
            </nav>

            {/* Search — expands on focus */}
            <div className={`hidden md:flex transition-all duration-300 ${searchFocused ? 'flex-1 max-w-lg' : 'w-64'}`}>
              <div className="relative w-full">
                <input type="text" placeholder="Search products..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full bg-[#F3F0EA]/70 border border-transparent rounded-full pl-10 pr-4 py-2 text-[13px] text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:bg-white focus:border-[#D6D3CE] focus:shadow-sm transition-all" />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29E]">{I.search}</span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-0.5 relative">
              {currentUser ? (
                <div className="relative">
                  <button 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)} 
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#F3F0EA]/75 hover:bg-[#E7E5E4] border border-[#E7E5E4]/40 transition-all focus:outline-none"
                    id="profile-dropdown-btn"
                  >
                    <img 
                      src={currentUser.avatarUrl || currentUser.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.name}`} 
                      alt="User Avatar" 
                      className="w-6 h-6 rounded-full border border-white object-cover"
                    />
                    <span className="text-[12px] font-semibold text-[#1C1917] hidden sm:inline max-w-[80px] truncate">{currentUser.name}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-[#78716C] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>

                  {userDropdownOpen && (
                    <>
                      {/* Invisible backdrop to dismiss dropdown */}
                      <div className="fixed inset-0 z-30" onClick={() => setUserDropdownOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E7E5E4] rounded-2xl shadow-xl py-2 z-40 animate-scaleIn">
                        <div className="px-4 py-2.5 border-b border-[#F3F0EA]">
                          <p className="text-xs font-bold text-[#1C1917] truncate">{currentUser.name}</p>
                          <p className="text-[10px] text-[#78716C] truncate mt-0.5">{currentUser.email}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#4A6741]/10 text-[#4A6741] uppercase tracking-wider">{currentUser.role}</span>
                        </div>
                        <button 
                          onClick={() => { setViewMode('store'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3F0EA] transition-all"
                        >
                          My Orders
                        </button>
                        <button 
                          onClick={() => { setViewMode('security'); setUserDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3F0EA] transition-all flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                          Security Lab
                        </button>
                        <hr className="my-1 border-[#F3F0EA]" />
                        <button 
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-red-650 hover:bg-red-50 transition-all"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setAuthModalOpen(true)} 
                  className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3F0EA]/60 transition-all"
                  title="Sign In / Register"
                  id="login-btn"
                >
                  {I.user}
                </button>
              )}
              <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3F0EA]/60 transition-all">{I.heart}</button>


              {/* Cart CTA */}
              <button className="relative flex items-center gap-2 ml-2 pl-3.5 pr-4 py-2 rounded-full bg-[#1C1917] text-white text-[13px] font-semibold hover:bg-[#292524] active:scale-[0.97] transition-all">
                {I.cart}
                <span className="hidden sm:inline">Cart</span>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#4A6741] text-[10px] font-bold text-white flex items-center justify-center shadow-sm">{cartItems.length}</span>
                )}
              </button>

              <button className="lg:hidden w-9 h-9 flex items-center justify-center ml-1 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F3F0EA]/60 transition-all">{I.menu}</button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        {/* Soft organic shapes — not circles, not gradients — just texture */}
        <svg className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/3 translate-x-1/4 opacity-[0.04]" viewBox="0 0 600 600" fill="none">
          <path d="M300 50C420 50 550 130 550 300C550 470 420 550 300 550C180 550 50 470 50 300C50 130 180 50 300 50Z" fill="#4A6741"/>
        </svg>
        <svg className="absolute bottom-0 left-0 w-[400px] h-[400px] translate-y-1/3 -translate-x-1/4 opacity-[0.03]" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" fill="#D97706"/>
        </svg>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Copy */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="animate-fadeInUp" style={{animationDelay:'0.1s'}}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A6741]/8 border border-[#4A6741]/12 text-[12px] font-semibold text-[#4A6741] tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741] animate-pulse" />
                  New Collection 2026
                </span>
              </div>

              {/* Heading with rotating word */}
              <div className="animate-fadeInUp" style={{animationDelay:'0.25s'}}>
                <h1 className="text-[40px] sm:text-[52px] lg:text-[60px] font-extrabold tracking-[-0.03em] leading-[1.05] text-[#1C1917]">
                  Products That<br />
                  <span className="text-[#4A6741]">
                    <RotatingText words={['Define You', 'Inspire You', 'Empower You', 'Move You']} />
                  </span>
                </h1>
              </div>

              {/* Subtext */}
              <p className="text-[16px] sm:text-[17px] text-[#78716C] max-w-md leading-[1.7] animate-fadeInUp" style={{animationDelay:'0.4s'}}>
                Curated electronics, designer furniture, and smart living essentials — from verified sellers worldwide.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 animate-fadeInUp" style={{animationDelay:'0.55s'}}>
                <a href="#products" className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1C1917] text-white text-[14px] font-semibold hover:bg-[#292524] active:scale-[0.97] transition-all shadow-md shadow-black/8">
                  Shop Now
                  <span className="group-hover:translate-x-0.5 transition-transform">{I.arrow}</span>
                </a>
                <a href="#categories" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-[#E7E5E4] text-[14px] font-medium text-[#44403C] hover:text-[#1C1917] hover:border-[#D6D3CE] hover:shadow-sm transition-all">
                  Explore Collections
                </a>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-4 animate-fadeInUp" style={{animationDelay:'0.7s'}}>
                {[
                  { value: 500, suffix: '+', label: 'Products' },
                  { value: 50, suffix: '+', label: 'Sellers' },
                  { value: 2000, suffix: '+', label: 'Reviews' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight"><Counter target={s.value} suffix={s.suffix} /></p>
                    <p className="text-[11px] text-[#A8A29E] font-medium mt-0.5 uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Image grid */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-12 gap-3">
                {/* Main large image */}
                <div className="col-span-7 animate-fadeInUp" style={{animationDelay:'0.3s'}}>
                  <div className="img-zoom rounded-[20px] overflow-hidden shadow-xl shadow-black/8">
                    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80" alt="Headphones" className="w-full aspect-[3/4] object-cover" />
                  </div>
                </div>
                {/* Stacked right */}
                <div className="col-span-5 flex flex-col gap-3 pt-10">
                  <div className="animate-fadeInUp" style={{animationDelay:'0.45s'}}>
                    <div className="img-zoom rounded-[20px] overflow-hidden shadow-lg shadow-black/6">
                      <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&auto=format&fit=crop&q=80" alt="Phone" className="w-full aspect-square object-cover" />
                    </div>
                  </div>
                  <div className="animate-fadeInUp" style={{animationDelay:'0.6s'}}>
                    <div className="img-zoom rounded-[20px] overflow-hidden shadow-lg shadow-black/6">
                      <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&auto=format&fit=crop&q=80" alt="Furniture" className="w-full aspect-[4/3] object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating card */}
              <div className="absolute -left-6 bottom-16 bg-white border border-[#E7E5E4] rounded-2xl px-5 py-4 shadow-lg shadow-black/5 animate-float max-w-[180px]">
                <div className="flex items-center gap-1 text-amber-500 mb-1.5">{I.star}{I.star}{I.star}{I.star}{I.star}</div>
                <p className="text-[13px] font-bold text-[#1C1917]">Aether Pro</p>
                <p className="text-xs text-[#A8A29E] mt-0.5">Noise-canceling</p>
                <p className="text-[15px] font-bold text-[#4A6741] mt-1">$299.99</p>
              </div>

              {/* Trusted badge */}
              <div className="absolute -right-2 top-8 bg-white border border-[#E7E5E4] rounded-xl px-4 py-2.5 shadow-md shadow-black/5 animate-fadeInUp" style={{animationDelay:'0.8s'}}>
                <div className="flex items-center gap-2">
                  <span className="text-[#4A6741]">{I.shield}</span>
                  <div>
                    <p className="text-[11px] font-bold text-[#1C1917]">100% Verified</p>
                    <p className="text-[9px] text-[#A8A29E]">All sellers vetted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALUE PROPS ═══ */}
      <section className="border-y border-[#E7E5E4] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-5">
          <Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 divide-x-0 lg:divide-x divide-[#F3F0EA]">
              {[
                { icon: I.truck, title: 'Free Shipping', desc: 'On orders over $99' },
                { icon: I.shield, title: 'Secure Payments', desc: '256-bit encrypted' },
                { icon: I.refresh, title: 'Easy Returns', desc: '30-day policy' },
                { icon: I.headphones, title: '24/7 Support', desc: 'Expert assistance' },
              ].map(({ icon, title, desc }, i) => (
                <div key={title} className="flex items-center gap-3 px-4 first:pl-0">
                  <span className="text-[#44403C] flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1C1917]">{title}</p>
                    <p className="text-[11px] text-[#A8A29E]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section id="categories" className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
        <Reveal><CategoryShowcase categories={mockCategories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} /></Reveal>
      </section>

      {/* ═══ PRODUCTS ═══ */}
      <section id="products" className="max-w-7xl mx-auto px-6 sm:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <Reveal className="lg:col-span-1">
            <div className="bg-white border border-[#E7E5E4] rounded-2xl p-5 space-y-5 sticky top-24">
              <h3 className="text-[13px] font-semibold text-[#1C1917] flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2" strokeLinecap="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
                Filters
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs"><span className="text-[#78716C]">Price Range</span><span className="text-[#1C1917] font-semibold">${priceRange}</span></div>
                <input type="range" min="40" max="1200" step="10" value={priceRange} onChange={e=>setPriceRange(+e.target.value)} className="w-full" />
                <div className="flex justify-between text-[10px] text-[#A8A29E]"><span>$40</span><span>$1,200</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-[#78716C] font-medium">Sort By</label>
                <select value={sortOption} onChange={e=>setSortOption(e.target.value)} className="w-full bg-[#F3F0EA] border border-[#E7E5E4] rounded-lg px-3 py-2 text-xs text-[#1C1917] focus:outline-none focus:border-[#D6D3CE]">
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
              <div className="rounded-xl p-4 bg-[#F3F0EA] border border-[#E7E5E4]">
                <p className="text-xs font-bold text-[#44403C]">⚡ Flash Deal</p>
                <p className="text-[11px] text-[#78716C] mt-1 leading-relaxed">Limited offers ending soon!</p>
              </div>
            </div>
          </Reveal>

          {/* Grid */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-[#78716C]">Showing <span className="text-[#1C1917] font-semibold">{filtered.length}</span> products</p>
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F3F0EA] border border-[#E7E5E4] text-xs text-[#44403C] font-medium hover:bg-[#E7E5E4] transition-all">
                    {selectedCategory.name}<span>{I.x}</span>
                  </button>
                )}
              </div>
            </Reveal>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((p, i) => <Reveal key={p.id} delay={Math.min(i+1,4)}><ProductCard product={p} onAddToCart={addToCart} onQuickView={setSelectedProduct} /></Reveal>)}
              </div>
            ) : (
              <Reveal>
                <div className="py-20 text-center border border-dashed border-[#E7E5E4] rounded-2xl bg-white">
                  <p className="text-[#A8A29E] text-sm mb-4">No products match your filters</p>
                  <button onClick={() => {setSelectedCategory(null);setSearchQuery('');setPriceRange(1200);setSortOption('newest');}} className="px-5 py-2.5 rounded-full bg-[#1C1917] text-xs font-semibold text-white hover:bg-[#292524] transition-all">Clear All Filters</button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className="bg-[#1C1917]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
          <Reveal>
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl sm:text-[32px] font-bold text-white tracking-tight leading-tight">Stay in the loop</h2>
              <p className="text-[14px] text-[#A8A29E] mt-3 mb-8 leading-relaxed">New arrivals, exclusive deals, and curated collections — delivered to your inbox.</p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email" className="flex-1 bg-white/8 border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-[#78716C] focus:outline-none focus:border-white/20 transition-all" />
                <button className="px-6 py-3 rounded-full bg-white text-[#1C1917] text-[13px] font-semibold hover:bg-[#F3F0EA] active:scale-[0.97] transition-all flex-shrink-0">Subscribe</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-[#E7E5E4] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">{I.logo}<span className="text-[15px] font-bold">ShopEase</span></div>
              <p className="text-[13px] text-[#78716C] leading-relaxed max-w-xs">Your premium marketplace for tech, lifestyle, and everything in between.</p>
              <div className="flex items-center gap-2.5 pt-1">
                {[I.twitter, I.instagram, I.github].map((ic, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-[#F3F0EA] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#E7E5E4] transition-all">{ic}</a>
                ))}
              </div>
            </div>
            {[
              { title: 'Shop', links: ['All Products', 'New Arrivals', 'Best Sellers', 'Deals'] },
              { title: 'Support', links: ['Help Center', 'Shipping', 'Returns', 'Contact'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
            ].map(({ title, links }) => (
              <div key={title} className="space-y-3">
                <h4 className="text-[11px] font-bold text-[#1C1917] uppercase tracking-[0.12em]">{title}</h4>
                <ul className="space-y-2">{links.map(l => <li key={l}><a href="#" className="text-[13px] text-[#78716C] hover:text-[#1C1917] transition-colors">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-[#F3F0EA] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-[#A8A29E]">© 2026 ShopEase. All rights reserved.</p>
            <p className="text-[11px] text-[#A8A29E]">Secure checkout powered by Stripe</p>
          </div>
        </div>
      </footer>

      {selectedProduct && <EntityDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onAuthSuccess={handleAuthSuccess} 
        status={backendStatus}
      />
    </div>
  );
}

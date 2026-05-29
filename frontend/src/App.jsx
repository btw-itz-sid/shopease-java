import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Github, 
  Layout, 
  SlidersHorizontal, 
  Search, 
  ShoppingBag, 
  ArrowUpDown, 
  ShieldCheck, 
  Eye, 
  FileCode, 
  ChevronRight,
  TrendingUp,
  Server
} from 'lucide-react';

import JPAVisualizer from './components/buyer/JPAVisualizer';
import CategoryShowcase from './components/buyer/CategoryShowcase';
import ProductCard from './components/buyer/ProductCard';
import EntityDetailModal from './components/buyer/EntityDetailModal';
import { mockCategories, mockProducts } from './utils/mockData';

function App() {
  const [viewMode, setViewMode] = useState('catalog'); // 'catalog' or 'jpa'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(1200); // Max slider
  const [sortOption, setSortOption] = useState('newest'); // 'newest' | 'price_asc' | 'price_desc' | 'rating'
  
  // Quick View State
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Shopping Cart Mock State
  const [cartItems, setCartItems] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Add Item to Cart with Dynamic Toast
  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product]);
    showToast(`"${product.title}" added to your persistent session cart!`);
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter Products based on selected filters (mimicking Spring Boot JPA queries)
  const filteredProducts = mockProducts.filter(product => {
    // 1. Search Query check
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category / Subcategory check (including hierarchical checking)
    let matchesCategory = true;
    if (selectedCategory) {
      matchesCategory = product.category.id === selectedCategory.id || 
                       (product.category.parent && product.category.parent.id === selectedCategory.id);
    }

    // 3. Price Range check
    const matchesPrice = product.price <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    // Mimicking DB ORDER BY options
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    if (sortOption === 'rating') return b.rating - a.rating;
    return b.id - a.id; // newest (descending ID)
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden font-sans antialiased">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-purple-900/5 blur-[160px] pointer-events-none" />

      {/* Floating Interactive Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/90 border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce">
          <div className="w-5 h-5 rounded-full bg-emerald-500/25 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ShopEase
              </span>
              <span className="ml-2 text-[9px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                Day 4
              </span>
            </div>
          </div>

          {/* Center Mode Switcher */}
          <div className="hidden md:flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                viewMode === 'catalog'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Catalog Preview</span>
            </button>
            <button
              onClick={() => setViewMode('jpa')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                viewMode === 'jpa'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>JPA Mapping Spec</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Mock Cart Widget */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-850 rounded-xl">
              <ShoppingBag className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-bold text-slate-200">{cartItems.length}</span>
            </div>

            <a
              href="https://github.com/btw-itz-sid/shopease-java"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Repo</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-12 z-10">
        
        {/* Welcome Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/5 text-[10px] font-bold text-violet-400 tracking-wider uppercase">
            <TrendingUp className="w-3 h-3 animate-pulse" />
            <span>Interactive Catalog Redesign</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Users, Categories & Products <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Visual Entity Explorer
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Day 4 introduces the User Entity and Role Enum, establishing database authorization structures and the relational product-seller mapping.
          </p>
        </div>

        {/* Small Screen View Switcher */}
        <div className="flex md:hidden w-full bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('catalog')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'catalog' ? 'bg-violet-600 text-white' : 'text-slate-400'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <button
            onClick={() => setViewMode('jpa')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === 'jpa' ? 'bg-violet-600 text-white' : 'text-slate-400'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>JPA Specs</span>
          </button>
        </div>

        {/* View Mode Router */}
        {viewMode === 'jpa' ? (
          <div className="animate-fadeIn">
            <JPAVisualizer />
          </div>
        ) : (
          <div className="space-y-10 animate-fadeIn">
            
            {/* JPA Visual Status Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/25 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category Entity</h4>
                  <p className="text-xs font-semibold text-white">Self-Referencing Map</p>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/25 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Entity</h4>
                  <p className="text-xs font-semibold text-white">@ManyToOne Mapped</p>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-600/10 border border-pink-500/25 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Indices & Slugs</h4>
                  <p className="text-xs font-semibold text-white">Unique Index Configured</p>
                </div>
              </div>

              <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-emerald-500/25 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Database Sync</h4>
                  <p className="text-xs font-semibold text-white">HikariCP Auto Updates</p>
                </div>
              </div>
            </div>

            {/* Category Component */}
            <CategoryShowcase 
              categories={mockCategories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Main Listing Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column: Filter Sidebar */}
              <div className="lg:col-span-1 bg-slate-900/30 border border-slate-850 rounded-2xl p-5 space-y-6 h-fit backdrop-blur-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Spring Query Mock</span>
                </div>

                {/* Search query */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ILike Match Title/Desc</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Type search terms..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Numeric Max Price</span>
                    <span className="text-white">${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="1200"
                    step="10"
                    value={priceRange}
                    onChange={e => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-violet-600 border border-slate-900"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>$40</span>
                    <span>$1200</span>
                  </div>
                </div>

                {/* Sort Option */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-indigo-400" />
                    <span>Spring OrderBy Spec</span>
                  </label>
                  <select
                    value={sortOption}
                    onChange={e => setSortOption(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="newest">Newest Listed First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated Products</option>
                  </select>
                </div>

                {/* Entity Relationship Diagram shortcut */}
                <div 
                  onClick={() => setViewMode('jpa')}
                  className="p-3 bg-gradient-to-tr from-violet-950/20 to-indigo-950/20 border border-violet-900/30 rounded-xl cursor-pointer hover:border-violet-500/30 transition-all group"
                >
                  <span className="text-[10px] font-bold text-violet-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" />
                    <span>Inspect JPA Schema</span>
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                    Tap to see full entities relationship & PostgreSQL tables columns layout.
                  </p>
                </div>
              </div>

              {/* Right Column: Product Grid */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                  <span>Showing {filteredProducts.length} persistent entries</span>
                  {selectedCategory && (
                    <span className="bg-violet-950/40 border border-violet-850 px-2 py-0.5 rounded text-[10px] text-violet-400 font-bold">
                      Segment: {selectedCategory.name}
                    </span>
                  )}
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onQuickView={setSelectedProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-slate-900/10 border border-dashed border-slate-850 rounded-2xl space-y-3">
                    <p className="text-slate-400 text-sm font-semibold">No persistent entities match these query filters.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setSearchQuery('');
                        setPriceRange(1200);
                        setSortOption('newest');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition-colors"
                    >
                      Reset all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Future Days Progress Checkpoint List */}
        <div className="mt-12 bg-slate-900/10 border border-slate-850 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.02] transform translate-y-8 translate-x-8 pointer-events-none">
            <Sparkles className="w-80 h-80 text-violet-600" />
          </div>
          
          <h3 className="text-sm font-extrabold text-slate-200 tracking-tight flex items-center gap-2 mb-4">
            <span>Project Roadmap Milestone Status</span>
            <span className="text-[10px] text-slate-500 font-mono">Phase 1/4 Completed</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Day 1: Setup</p>
                <p className="text-[9px] text-slate-500 leading-snug">POM, dependencies & Spring initializer set.</p>
              </div>
            </div>
            
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Day 2: DB Connection</p>
                <p className="text-[9px] text-slate-500 leading-snug">PostgreSQL, HikariCP & update configuration.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-200">Day 3: Entities</p>
                <p className="text-[9px] text-slate-500 leading-snug">JPA Category & Product mappings + Live Showcase.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 flex items-start gap-2.5 bg-violet-950/10 border-violet-900/30">
              <div className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0 mt-0.5">4</div>
              <div>
                <p className="text-[11px] font-bold text-violet-400">Day 4: Users & Roles</p>
                <p className="text-[9px] text-slate-450 leading-snug">User Entity, Enum roles & ManyToOne seller FK upgrade.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Entity Detailed Modal Inspector */}
      {selectedProduct && (
        <EntityDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ShopEase Marketplace. All backend models structured under JPA specifications.</p>
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4" />
            <span>PostgreSQL Data Layer Cryptographically Safe</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

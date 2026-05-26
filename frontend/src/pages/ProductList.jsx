import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { FiChevronDown } from 'react-icons/fi';

export default function ProductList() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    category_slug: params.get('cat') || '',
    min_price: params.get('min') || '',
    max_price: params.get('max') || '',
    sort: params.get('sort') || 'newest',
  });

  useEffect(() => {
    categoryAPI.getAll().then(r => setCats(r.data.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    productAPI.getAll(filters)
      .then(r => setProducts(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
    const sp = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) sp.set(k, v); });
    setParams(sp);
  }, [filters, setParams]);

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4 flex gap-5">

        {/* ── Left Sidebar (Amazon style) ─────────────────── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white rounded border border-[#D5D9D9] p-4 shadow-sm sticky top-28">
            <h2 className="font-bold text-[#0F1111] text-lg border-b border-[#D5D9D9] pb-2 mb-3">Filters</h2>

            {/* Category */}
            <div className="mb-5">
              <h3 className="text-[#0F1111] text-sm font-bold mb-2">Department</h3>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setFilters({ ...filters, category_slug: '' })}
                    className={`text-sm text-left w-full hover:text-[#C7511F] hover:underline ${!filters.category_slug ? 'font-bold text-[#C7511F]' : 'text-[#007185]'}`}>
                    Any Department
                  </button>
                </li>
                {cats.map(c => (
                  <li key={c.id}>
                    <button onClick={() => setFilters({ ...filters, category_slug: c.slug })}
                      className={`text-sm text-left w-full hover:text-[#C7511F] hover:underline ${filters.category_slug === c.slug ? 'font-bold text-[#C7511F]' : 'text-[#007185]'}`}>
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="mb-5 border-t border-[#D5D9D9] pt-4">
              <h3 className="text-[#0F1111] text-sm font-bold mb-2">Price</h3>
              <ul className="space-y-1.5">
                {[
                  { l: 'Under ₹1,000', min: '', max: '1000' },
                  { l: '₹1,000 – ₹5,000', min: '1000', max: '5000' },
                  { l: '₹5,000 – ₹20,000', min: '5000', max: '20000' },
                  { l: 'Over ₹20,000', min: '20000', max: '' },
                ].map(r => (
                  <li key={r.l}>
                    <button onClick={() => setFilters({ ...filters, min_price: r.min, max_price: r.max })}
                      className={`text-sm text-left w-full hover:text-[#C7511F] hover:underline ${filters.min_price === r.min && filters.max_price === r.max ? 'font-bold text-[#C7511F]' : 'text-[#007185]'}`}>
                      {r.l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Star Rating */}
            <div className="border-t border-[#D5D9D9] pt-4">
              <h3 className="text-[#0F1111] text-sm font-bold mb-2">Avg. Customer Review</h3>
              {[4, 3, 2].map(stars => (
                <div key={stars} className="flex items-center gap-1 text-sm text-[#007185] hover:text-[#C7511F] cursor-pointer mb-1 hover:underline">
                  <span className="text-[#FF9900]">{'★'.repeat(stars)}</span>
                  <span className="text-[#565656]">& Up</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main Results ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="bg-[#F3F3F3] border border-[#D5D9D9] rounded px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-[#565656] text-sm">
              {filters.search && <><span className="text-[#0F1111] font-medium">Results for "</span><span className="text-[#C7511F] font-bold">{filters.search}</span><span className="text-[#0F1111] font-medium">"</span>&nbsp;</>}
              <span>{loading ? '...' : products.length} results</span>
            </p>
            <div className="flex items-center gap-2">
              <label className="text-[#0F1111] text-sm font-medium">Sort by:</label>
              <select
                className="border border-[#D5D9D9] rounded px-2 py-1 text-sm text-[#0F1111] bg-white focus:outline-none focus:border-[#E77600]"
                value={filters.sort}
                onChange={e => setFilters({ ...filters, sort: e.target.value })}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="bg-white rounded border border-[#D5D9D9] animate-pulse">
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-4/5" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-[#D5D9D9] rounded p-8 text-center">
              <p className="text-2xl font-medium text-[#0F1111] mb-2">No results for "{filters.search}"</p>
              <p className="text-[#565656] text-sm mb-4">Try checking your spelling or use more general terms</p>
              <button onClick={() => setFilters({ search: '', category_slug: '', min_price: '', max_price: '', sort: 'newest' })}
                className="text-[#007185] text-sm hover:text-[#C7511F] hover:underline">
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { useCartStore } from '../../store/useCartStore';
import { FiSearch, FiShoppingCart, FiChevronDown, FiMapPin, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ── Top Bar (Amazon dark) ─────────────────────────────── */}
      <div className="bg-[#0F1111] text-white">
        <div className="max-w-[1500px] mx-auto px-3 flex items-center gap-2 h-[60px]">

          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 border border-transparent hover:border-white rounded px-1 py-1 mr-2 transition-colors">
            <span className="text-white font-black text-xl tracking-tight leading-none">
              shop<span className="text-[#FF9900]">ease</span>
            </span>
            <span className="text-[#FF9900] text-[10px] font-bold ml-0.5 mt-3">.in</span>
          </Link>

          {/* Deliver To */}
          <div className="hidden lg:flex flex-col items-start border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer shrink-0 transition-colors">
            <span className="text-[#ccc] text-[11px]">Deliver to</span>
            <div className="flex items-center gap-1">
              <FiMapPin className="text-white text-sm" />
              <span className="text-white text-sm font-bold">India</span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 flex h-10 mx-2">
            <select className="bg-[#F3F3F3] text-[#555] text-xs px-2 rounded-l border-none outline-none cursor-pointer border-r border-[#cdcdcd] shrink-0 hidden md:block">
              <option>All</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Books</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ShopEase"
              className="flex-1 px-3 text-black text-sm outline-none border-none"
            />
            <button type="submit" className="bg-[#FF9900] hover:bg-[#F0A000] w-12 flex items-center justify-center rounded-r transition-colors shrink-0">
              <FiSearch className="text-black text-xl font-bold" />
            </button>
          </form>

          {/* Language */}
          <div className="hidden xl:flex items-center gap-0.5 border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer transition-colors shrink-0">
            <span className="text-white text-sm font-bold">EN</span>
            <FiChevronDown className="text-white text-xs" />
          </div>

          {/* Account */}
          {isAuthenticated ? (
            <div className="relative group shrink-0">
              <div className="border border-transparent hover:border-white rounded px-2 py-1 cursor-pointer transition-colors">
                <div className="text-[#ccc] text-[11px]">Hello, {user?.name?.split(' ')[0]}</div>
                <div className="text-white text-sm font-bold flex items-center gap-0.5">
                  Account & Lists <FiChevronDown className="text-xs" />
                </div>
              </div>
              <div className="absolute right-0 top-full mt-1 w-60 bg-white text-black shadow-2xl rounded z-50 py-3 hidden group-hover:block">
                <div className="px-4 pb-3 border-b border-gray-200">
                  <button onClick={() => { logout(); }} className="w-full bg-[#FF9900] hover:bg-[#F0A000] text-black font-bold text-sm py-1.5 rounded transition-colors">
                    Sign Out
                  </button>
                </div>
                <div className="py-2 px-4">
                  {user?.role === 'seller' && (
                    <Link to="/seller" className="block py-1 text-sm hover:text-[#c7511f] hover:underline">Seller Dashboard</Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block py-1 text-sm hover:text-[#c7511f] hover:underline">Admin Panel</Link>
                  )}
                  <Link to="/orders" className="block py-1 text-sm hover:text-[#c7511f] hover:underline">Returns & Orders</Link>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="border border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0">
              <div className="text-[#ccc] text-[11px]">Hello, sign in</div>
              <div className="text-white text-sm font-bold flex items-center gap-0.5">
                Account & Lists <FiChevronDown className="text-xs" />
              </div>
            </Link>
          )}

          {/* Orders */}
          <Link to="/orders" className="hidden md:flex border border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0">
            <div>
              <div className="text-[#ccc] text-[11px]">Returns</div>
              <div className="text-white text-sm font-bold">& Orders</div>
            </div>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-end gap-1 border border-transparent hover:border-white rounded px-2 py-1 transition-colors shrink-0">
            <div className="relative">
              <FiShoppingCart className="text-white text-3xl" />
              <span className="absolute -top-1 left-3 text-[#FF9900] text-sm font-black min-w-[16px] text-center leading-none">
                {cartCount}
              </span>
            </div>
            <span className="text-white text-sm font-bold hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* ── Sub Nav (Amazon categories bar) ──────────────────── */}
      <div className="bg-[#232F3E] text-white">
        <div className="max-w-[1500px] mx-auto px-3 flex items-center h-[38px] gap-1 overflow-x-auto scrollbar-none">
          <button className="flex items-center gap-1.5 px-3 py-1 text-sm font-bold hover:bg-[#37475A] rounded whitespace-nowrap transition-colors">
            <FiMenu /> All
          </button>
          {["Today's Deals", 'Electronics', 'Fashion', 'Books', 'Mobiles', 'Home & Kitchen', 'Customer Service', 'Sell'].map(cat => (
            <Link
              key={cat}
              to={`/products?search=${cat.toLowerCase().replace(/[^a-z]/g, '')}`}
              className="px-3 py-1 text-sm hover:bg-[#37475A] rounded whitespace-nowrap transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-white text-sm py-3 transition-colors text-center block"
      >
        Back to top
      </button>

      {/* Main Footer Links - Netflix dark */}
      <div className="bg-[#232F3E] text-white py-10">
        <div className="max-w-[1500px] mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-base mb-3">Get to Know Us</h4>
            <ul className="space-y-2 text-sm text-[#DDD] font-light">
              <li><a href="#" className="hover:text-white hover:underline">About ShopEase</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Careers</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Press Releases</a></li>
              <li><a href="#" className="hover:text-white hover:underline">ShopEase Science</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-3">Connect with Us</h4>
            <ul className="space-y-2 text-sm text-[#DDD] font-light">
              <li><a href="#" className="hover:text-white hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Twitter</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Instagram</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-3">Make Money with Us</h4>
            <ul className="space-y-2 text-sm text-[#DDD] font-light">
              <li><Link to="/register" className="hover:text-white hover:underline">Sell on ShopEase</Link></li>
              <li><a href="#" className="hover:text-white hover:underline">Become an Affiliate</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Advertise Your Products</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-3">Let Us Help You</h4>
            <ul className="space-y-2 text-sm text-[#DDD] font-light">
              <li><a href="#" className="hover:text-white hover:underline">COVID-19 and Amazon</a></li>
              <li><Link to="/orders" className="hover:text-white hover:underline">Your Account</Link></li>
              <li><Link to="/orders" className="hover:text-white hover:underline">Your Orders</Link></li>
              <li><a href="#" className="hover:text-white hover:underline">Customer Service</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#131A22] py-5">
        <div className="max-w-[1500px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <Link to="/" className="text-2xl font-black text-white tracking-tight">
            shop<span className="text-[#FF9900]">ease</span>
            <span className="text-[#FF9900] text-sm">.in</span>
          </Link>
          <p className="text-[#DDD] text-xs text-center">
            © 2024-{new Date().getFullYear()}, ShopEase.in, Inc. or its affiliates · All rights reserved.
          </p>
          <div className="flex gap-3 text-xs text-[#DDD]">
            <a href="#" className="hover:text-white hover:underline">Privacy Policy</a>
            <a href="#" className="hover:text-white hover:underline">Terms of Use</a>
            <a href="#" className="hover:text-white hover:underline">Cookie Notice</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

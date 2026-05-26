import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#EAEDED] flex flex-col items-center py-8 px-4">
      <Link to="/" className="mb-6">
        <span className="text-3xl font-black text-[#0F1111] tracking-tight">
          shop<span className="text-[#FF9900]">ease</span>
          <span className="text-[#FF9900] text-base">.in</span>
        </span>
      </Link>

      <div className="bg-white w-full max-w-[380px] rounded border border-[#D5D9D9] px-7 py-6 shadow-sm">
        <h1 className="text-2xl font-medium text-[#0F1111] mb-2">Password assistance</h1>
        <p className="text-sm text-[#565656] mb-5">
          Enter the email address associated with your ShopEase account.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-bold text-[#0F1111] mb-1">Email address</label>
          <input type="email" className="w-full border border-[#A6A6A6] rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#E77600] focus:ring-2 focus:ring-[#E77600]/30 text-[#0F1111]" />
        </div>
        <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium py-1.5 rounded text-sm transition-colors mb-4">
          Continue
        </button>
        <div className="border-t border-[#D5D9D9] pt-4 text-sm text-[#0F1111]">
          Has your email address changed?<br />
          <span className="text-[#565656] text-xs">
            If you no longer use the email address associated with your ShopEase account,{' '}
            <a href="#" className="text-[#007185] hover:underline">contact customer service</a> for help restoring access to your account.
          </span>
        </div>
      </div>

      <div className="mt-5 flex gap-4 text-xs text-[#007185]">
        <a href="#" className="hover:underline">Conditions of Use</a>
        <a href="#" className="hover:underline">Privacy Notice</a>
        <a href="#" className="hover:underline">Help</a>
      </div>
      <p className="mt-2 text-xs text-[#767676]">© 2026 ShopEase.in, Inc.</p>
    </div>
  );
}

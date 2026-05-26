import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { FiTrash2, FiPlus, FiMinus, FiArrowRight } from 'react-icons/fi';

const PLACEHOLDER = 'https://placehold.co/100x100/EAEDED/0F1111?text=?';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, deliveryFee, tax, total } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="bg-[#EAEDED] min-h-screen py-8">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="bg-white border border-[#D5D9D9] rounded p-10 text-center">
          <h2 className="text-2xl font-medium text-[#0F1111] mb-2">Your ShopEase Cart is empty</h2>
          <p className="text-[#565656] text-sm mb-6">Your shopping cart is waiting. Give it purpose – fill it with grocery, clothing, household supplies, electronics and more.</p>
          <Link to="/products" className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium px-8 py-2 rounded-md text-sm transition-colors inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#EAEDED] min-h-screen py-4">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left: Cart Items */}
          <div className="lg:col-span-9">
            <div className="bg-white border border-[#D5D9D9] rounded shadow-sm">
              <div className="p-5 border-b border-[#D5D9D9] flex justify-between items-baseline">
                <h1 className="text-[#0F1111] text-3xl font-medium">Shopping Cart</h1>
                <span className="text-[#565656] text-sm">Price</span>
              </div>

              {items.map(item => (
                <div key={item.product_id} className="p-5 border-b border-[#D5D9D9] flex gap-4">
                  {/* Image */}
                  <Link to={`/products/${item.product_id}`} className="shrink-0 w-24 h-24 bg-[#EAEDED] rounded overflow-hidden flex items-center justify-center border border-[#D5D9D9]">
                    <img src={item.image || PLACEHOLDER} alt={item.title} className="w-full h-full object-contain p-1" onError={e => e.target.src = PLACEHOLDER} />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product_id}`} className="text-[#0F1111] text-base hover:text-[#C7511F] hover:underline font-medium line-clamp-2">
                      {item.title}
                    </Link>
                    <p className="text-[#007600] text-sm font-medium mt-1">In Stock</p>
                    <p className="text-[#565656] text-xs mt-0.5">Eligible for FREE Shipping</p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3 text-sm">
                      <div className="flex items-center border border-[#D5D9D9] rounded overflow-hidden bg-[#F3F3F3]">
                        <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="px-2.5 py-1 hover:bg-[#E9E9E9] border-r border-[#D5D9D9] text-[#0F1111]">
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="px-3 py-1 text-sm font-bold text-[#0F1111] bg-white border-r border-l border-[#D5D9D9]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-2.5 py-1 hover:bg-[#E9E9E9] text-[#0F1111] disabled:opacity-40">
                          <FiPlus className="text-xs" />
                        </button>
                      </div>
                      <span className="text-[#D5D9D9]">|</span>
                      <button onClick={() => removeItem(item.product_id)} className="text-[#007185] hover:text-[#C7511F] hover:underline">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right">
                    <span className="text-[#0F1111] text-lg font-bold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-5 text-right">
                <span className="text-[#0F1111] text-lg">
                  Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items):{' '}
                  <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Summary / Buy Box */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#D5D9D9] rounded shadow-sm p-5 sticky top-28">
              <div className="flex items-center gap-2 text-sm text-[#007600] mb-3">
                <span>✓</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? 'Your order qualifies for FREE Delivery.' : `Add ₹${(499 - subtotal).toFixed(0)} more for FREE Delivery.`}
                </span>
              </div>

              <div className="text-[#0F1111] text-lg mb-4">
                Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items):{' '}
                <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] text-[#0F1111] font-medium py-2 rounded-full text-sm transition-colors mb-2"
              >
                Proceed to Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

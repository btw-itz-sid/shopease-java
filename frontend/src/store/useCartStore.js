import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items:     [],     // [{ product_id, title, price, image, quantity, stock }]
      promoCode: '',
      discount:  0,

      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.product_id === product.id);
        if (existing) {
          set({ items: items.map((i) =>
            i.product_id === product.id
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i
          )});
        } else {
          set({ items: [...items, {
            product_id: product.id, title: product.title,
            price: Number(product.price), image: product.images?.[0] || null,
            quantity, stock: product.stock,
          }]});
        }
      },
      removeItem:     (id)  => set({ items: get().items.filter((i) => i.product_id !== id) }),
      updateQuantity: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return; }
        set({ items: get().items.map((i) => i.product_id === id ? { ...i, quantity: qty } : i) });
      },
      clearCart:   () => set({ items: [], promoCode: '', discount: 0 }),
      applyPromo:  (code, discount) => set({ promoCode: code, discount }),

      get itemCount() { return get().items.reduce((s, i) => s + i.quantity, 0); },
      get subtotal()  { return get().items.reduce((s, i) => s + i.price * i.quantity, 0); },
      get deliveryFee() { const sub = get().subtotal; return sub > 500 ? 0 : 49; },
      get tax()       { return (get().subtotal - get().discount) * 0.18; },
      get total()     { const s = get(); return s.subtotal - s.discount + s.deliveryFee + s.tax; },
    }),
    { name: 'shopease-cart' }
  )
);

import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Lock,
  Tag,
} from 'lucide-react';
import { CartItem, CurrencyCode, CURRENCIES } from '../types/store';
import { sound } from '../utils/sound';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  currency: CurrencyCode;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  currency,
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const currInfo = CURRENCIES[currency];
  const formatPrice = (usd: number) => `${currInfo.symbol}${Math.round(usd * currInfo.rate)}`;

  const subtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  const discountAmount = subtotal * discountPercent;
  const finalTotal = subtotal - discountAmount;
  const freeShippingThreshold = 200;
  const shippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const shippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VIP20' || promoCode.trim().toUpperCase() === 'TOONHUB') {
      sound.playSuccess();
      setDiscountPercent(0.2);
      setPromoSuccess('PROMO APPLIED // 20% OFF');
      setPromoError('');
    } else {
      sound.playClick();
      setPromoError('INVALID CODE (TRY "VIP20")');
      setPromoSuccess('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      />

      {/* Slide-in Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside
          aria-label="Shopping Bag Drawer"
          className="w-screen max-w-md bg-[#0e0e0e] border-l border-white/15 text-white flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={18} className="text-lime-400" />
              <h2
                className="text-xl font-black uppercase tracking-tight text-white"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                YOUR SHOPPING BAG ({items.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Free Shipping Progress Milestone */}
          <div className="px-6 py-3.5 bg-black/60 border-b border-white/10">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="flex items-center gap-1.5 text-white/80">
                <Truck size={13} className="text-lime-400" />
                {shippingRemaining === 0 ? (
                  <span className="text-lime-400 font-bold">QUALIFIED FOR FREE EXPRESS SHIPPING</span>
                ) : (
                  <span>
                    ADD <strong className="text-white">{formatPrice(shippingRemaining)}</strong> FOR FREE SHIPPING
                  </span>
                )}
              </span>
              <span className="text-white/60 font-bold">{Math.round(shippingPercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${shippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-white/60">
                <ShoppingBag size={48} className="text-white/20" />
                <div className="font-mono text-sm uppercase">YOUR BAG IS CURRENTLY EMPTY</div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-lime-400 transition-colors"
                >
                  START EXPLORING DROPS
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-center justify-between"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-black/40 border border-white/10 p-1 flex items-center justify-center shrink-0">
                    <img src={item.src} alt={item.title} className="w-full h-full object-contain" />
                  </div>

                  {/* Item Specs */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black uppercase truncate text-white">
                      {item.title}
                    </div>
                    <div className="text-[11px] font-mono text-lime-400 truncate mb-1">
                      {item.colorway}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-white/60 mb-2">
                      <span>SIZE: {item.size}</span>
                      {item.isCustom && <span className="text-purple-400">• BESPOKE</span>}
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-white/20 rounded-lg bg-black/40">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-2 py-0.5 text-white/70 hover:text-white"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-2 py-0.5 text-white/70 hover:text-white"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-white/40 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono text-white">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/15 bg-black/90 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE (USE 'VIP20')"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-lime-400 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono font-bold uppercase transition-colors"
                >
                  APPLY
                </button>
              </form>

              {promoSuccess && <div className="text-[10px] font-mono text-lime-400">{promoSuccess}</div>}
              {promoError && <div className="text-[10px] font-mono text-red-400">{promoError}</div>}

              {/* Subtotal Calculation */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-white/70">
                  <span>SUBTOTAL</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-lime-400">
                    <span>DISCOUNT (20%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-white/70">
                  <span>DHL 2-DAY SHIPPING</span>
                  <span>{shippingRemaining === 0 ? 'FREE' : formatPrice(15)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-white/10 font-mono">
                  <span>ESTIMATED TOTAL</span>
                  <span className="text-lime-300">
                    {formatPrice(finalTotal + (shippingRemaining === 0 ? 0 : 15))}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => alert(`Redirecting to 100% Encrypted Shopify Plus Checkout for ${formatPrice(finalTotal)} USD...`)}
                className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-base tracking-wider hover:bg-lime-400 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                <Lock size={16} />
                <span>INSTANT CHECKOUT — {formatPrice(finalTotal)}</span>
                <ArrowRight size={18} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-white/50">
                <ShieldCheck size={12} className="text-lime-400" />
                <span>256-BIT ENCRYPTED SHOPIFY PLUS CHECKOUT</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

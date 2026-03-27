"use client";

import { X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "@/src/store/slices/cartSlice";
import { toast } from "sonner";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: any[]; // We can use a proper type later, for now just any[]
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems = [],
}: CartSidebarProps) {
  const dispatch = useDispatch();

  return (
    <>
      {/* 1. Immersive Atmospheric Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0B1221]/40 backdrop-blur-md z-[60] transition-opacity duration-700 animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* 2. Premium Glass Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-[100vw] bg-white/90 backdrop-blur-3xl z-[70] transform transition-transform duration-700 ease-out flex flex-col shadow-[-20px_0_80px_rgba(0,0,0,0.15)] border-l border-white/20 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header: Exclusive Collection Identity */}
        <div className="flex items-center justify-between p-8 border-b border-black/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">
              Your Cart
            </span>
            <h2 className="hero-display text-3xl tracking-tighter text-[#0B1221]">
              Shopping Cart.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500 group"
          >
            <X size={20} className="text-[#0B1221] group-hover:rotate-90 transition-transform duration-500" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content: Immersive Item Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="relative w-64 h-64 grayscale opacity-20">
                <Image
                  src="https://picsum.photos/seed/emptycollection/400/400"
                  alt="Empty Collection"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="space-y-4">
                <p className="hero-display text-2xl tracking-tighter text-[#0B1221]/40">
                  Your cart is currently empty.
                </p>
                <button
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Return to Shop →
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="group flex gap-6 p-5 bg-gray-50/50 rounded-[2rem] border border-black/5 hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 animate-in fade-in slide-in-from-right-8"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative w-24 h-24 bg-gray-100 rounded-[1.5rem] overflow-hidden shrink-0 border border-black/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base font-black tracking-tighter text-[#0B1221] pr-4 line-clamp-1">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => {
                            dispatch(removeFromCart({ id: item.id, size: item.size }));
                            toast.info("Item Removed", { description: "The item has been removed from your cart." });
                          }}
                          className="text-[#0B1221]/20 hover:text-red-500 transition-colors"
                        >
                          <X size={16} strokeWidth={2} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600/60">
                          Size {item.size}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/20">
                          Premium Fit
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <p className="text-base font-black text-[#0B1221]">
                        ৳{item.price * item.quantity}
                      </p>

                      {/* Quantity Pill: High-Density Control */}
                      <div className="flex items-center gap-4 bg-white border border-black/5 rounded-2xl px-3 py-1.5 shadow-sm">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, size: item.size, quantity: Math.max(1, item.quantity - 1) }))
                          }
                          className="w-6 h-6 flex items-center justify-center text-[#0B1221]/40 hover:text-blue-500 transition-colors"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="text-xs font-black text-[#0B1221] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))
                          }
                          className="w-6 h-6 flex items-center justify-center text-[#0B1221]/40 hover:text-blue-500 transition-colors"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Architectural Summary */}
        {cartItems.length > 0 && (
          <div className="p-8 border-t border-black/5 bg-white/50 backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-end px-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B1221]/30">
                  Total Amount
                </span>
                <span className="hero-display text-3xl tracking-tighter text-[#0B1221]">
                  ৳{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
                </span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                Tax Included
              </p>
            </div>
            
            <Link
              href="/checkout"
              onClick={onClose}
              className="btn-glow block w-full bg-[#0B1221] text-white text-center py-5 rounded-[22px] text-xs font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-2xl shadow-black/20 border border-white/5 active:scale-[0.98]"
            >
              Checkout
            </Link>

            <p className="text-[9px] font-medium text-center text-[#0B1221]/30 uppercase tracking-[0.2em] px-8 leading-relaxed">
              Secure checkout. <br /> Fast and reliable shipping.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { resolveImageUrl } from "@/src/utils/image";
import {
  ArrowRight,
  CheckCircle,
  ShoppingBag,
  Truck,
  Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderData {
  orderId: string;
  items: any[];
  totalPrice: number;
  shippingCost: number;
  paymentMethod: string;
  createdAt: string;
}

export default function ThankYouPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedOrder = sessionStorage.getItem("lastOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center h-[60vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900">
          No order found
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          It looks like you haven&apos;t placed an order recently or your
          session has expired.
        </p>
        <Link
          href="/products"
          className="bg-[#0B1221] text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 py-10">
      {/* 1. Cinematic Success Hero */}
      <div className="relative h-[45vh] lg:h-[55vh] flex items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20 hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full mb-8 animate-in zoom-in duration-1000">
            <CheckCircle size={40} className="text-green-500" strokeWidth={1} />
          </div>
          <p className="text-green-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Success!
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            Thank You.
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
              Your order is placed / ID: {order.orderId || (order as any)._id}
            </span>
            <div className="h-6 w-px bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* 2. Delivery Info */}
          <div className="glass-card bg-blue-600 p-10 lg:p-16 rounded-[4rem] text-white flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-blue-500/20 animate-in slide-in-from-bottom-12 duration-1000 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-sky-600/50 opacity-100" />
            <div className="relative z-10 w-20 h-20 bg-white/10 border border-white/20 rounded-[2rem] flex items-center justify-center backdrop-blur-3xl shrink-0 group-hover:scale-110 transition-transform duration-700">
              <Truck size={36} strokeWidth={1} />
            </div>
            <div className="relative z-10 flex-1 text-center md:text-left space-y-3">
              <h3 className="hero-display text-3xl tracking-tighter uppercase">
                Delivery Info.
              </h3>
              <p className="text-sm font-bold text-white/80 uppercase tracking-widest">
                Estimated Arrival: 2–5 Business Days
              </p>
              <p className="text-xs text-white/80 leading-relaxed max-w-lg">
                We are preparing your items for delivery. You will receive a
                tracking number by email soon.
              </p>
            </div>
          </div>

          {/* 3. Order Summary */}
          <div className="glass-card bg-white rounded-[4rem] border border-black/5 overflow-hidden shadow-2xl shadow-black/5 animate-in slide-in-from-bottom-12 duration-1000 delay-200">
            <div className="p-10 lg:p-12 border-b border-black/5 bg-gray-50/30 flex justify-between items-center">
              <div>
                <p className="text-[#0B1221]/40 text-[9px] font-black uppercase tracking-[0.4em] mb-1">
                  Info
                </p>
                <h2 className="hero-display text-xl lg:text-2xl tracking-tighter text-[#0B1221] uppercase">
                  Order Summary.
                </h2>
              </div>
              <div className="text-right flex flex-col">
                <div>
                  <span className="text-[#0B1221]/40 text-[9px] font-black uppercase tracking-[0.4em] mb-1">
                    Order Date
                  </span>
                  <span className="text-sm font-black text-[#0B1221]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-sm font-black text-[#0B1221]">
                  ID: {order.orderId || (order as any)._id || "N/A"}
                </span>
              </div>
            </div>

            <div className="p-10 lg:p-16">
              <div className="space-y-10">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-8 items-center group">
                    <div className="relative w-24 h-24 bg-gray-50 rounded-[2rem] overflow-hidden border border-black/5 shrink-0 transition-transform duration-700 group-hover:scale-105 group-hover:shadow-xl">
                      <Image
                        src={resolveImageUrl(
                          item.product?.images?.[0] || "/placeholder.jpg",
                        )}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">
                        Product {idx + 1}
                      </p>
                      <h4 className="text-lg font-black text-[#0B1221] tracking-tighter uppercase truncate group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-widest">
                          SKU: {item.sku || "N/A"}
                        </span>
                        <div className="w-1 h-1 bg-black/5 rounded-full" />
                        <span className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-widest">
                          Size: {item.size}
                        </span>
                        <div className="w-1 h-1 bg-black/5 rounded-full" />
                        <span className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-widest">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-[#0B1221]/20 uppercase tracking-widest mb-1">
                        Price
                      </p>
                      <div className="text-lg font-black text-[#0B1221]">
                        ৳{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 pt-10 border-t border-black/5 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold text-[#0B1221]">
                    ৳{order.totalPrice - order.shippingCost}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest">
                      Shipping
                    </span>
                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em]">
                      Standard Delivery
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[#0B1221]">
                    ৳{order.shippingCost}
                  </span>
                </div>
                <div className="flex justify-between items-center py-6 border-y border-black/5">
                  <span className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest">
                    Payment Method
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black text-[#0B1221] uppercase tracking-widest">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <span className="hero-display text-2xl tracking-tighter text-[#0B1221] uppercase">
                    Order Total.
                  </span>
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">
                    ৳{order.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-12 duration-1000 delay-500">
            <Link
              href="/products"
              className="group relative h-20 bg-[#0B1221] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-black shadow-2xl shadow-black/20"
            >
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <ShoppingBag
                size={18}
                className="relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
              <span className="relative z-10">Continue Shopping</span>
            </Link>

            <Link
              href="/"
              className="group relative h-20 bg-white border border-black/5 text-[#0B1221] rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-gray-50 hover:shadow-2xl hover:shadow-black/5"
            >
              <div className="absolute inset-0 bg-gray-50/50 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <Home
                size={18}
                className="relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
              <span className="relative z-10">Back to Home</span>
            </Link>

            <Link
              href="/profile/orders"
              className="group relative h-20 bg-white border border-black/5 text-[#0B1221] rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 overflow-hidden transition-all hover:bg-gray-50 hover:shadow-2xl hover:shadow-black/5 sm:col-span-2 lg:col-span-1"
            >
              <span className="relative z-10">View Orders</span>
              <ArrowRight
                size={18}
                className="relative z-10 transition-transform duration-500 group-hover:translate-x-2"
              />
            </Link>
          </div>

          <div className="pt-20 text-center space-y-2">
            <p className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-[0.3em]">
              Need help with your order?
            </p>
            <Link
              href="/about"
              className="inline-block text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-600/20 pb-1 hover:text-blue-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

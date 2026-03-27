"use client";

import { Calendar, CheckCircle2, CreditCard, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export function OrderDetailModal({
  isOpen,
  onClose,
  order,
}: OrderDetailModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentStep = statuses.indexOf(order.status);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
      {/* 1. Cinematic Overlay */}
      <div
        className="absolute inset-0 bg-[#0B1221]/60 backdrop-blur-md transition-opacity duration-700"
        onClick={onClose}
      />

      {/* 2. Order Details Modal */}
      <div className="relative w-full max-w-2xl bg-white/95 rounded-t-[3rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col transform transition-all animate-in slide-in-from-bottom-20 duration-700 border border-black/5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.02] to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-black/5 bg-white relative z-10">
          <div>
            <p className="text-blue-600 text-[9px] font-black uppercase tracking-[0.5em] mb-1">
              Details
            </p>
            <h2 className="hero-display text-2xl lg:text-3xl tracking-tighter text-[#0B1221] uppercase">
              Order Details.
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest">
                {order.id}
              </span>
              <div className="w-1 h-1 rounded-full bg-blue-600/30" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                {order.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all duration-500 group"
          >
            <X
              size={20}
              className="transition-transform group-hover:rotate-90"
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 relative z-10 custom-scrollbar">
          {/* Tracking */}
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                Delivery Status
              </h3>
              <div className="flex-1 h-px bg-black/5" />
            </div>

            <div className="relative flex justify-between px-2">
              <div className="absolute top-5 left-8 right-8 h-px bg-black/5 -z-10" />
              <div
                className="absolute top-5 left-8 h-px bg-blue-600 transition-all duration-1000 -z-10 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                style={{
                  width: `calc(${(currentStep / (statuses.length - 1)) * 100}% - 4rem)`,
                }}
              />

              {statuses.map((status, index) => {
                const isActive = index <= currentStep;
                const isPast = index < currentStep;

                return (
                  <div
                    key={status}
                    className="flex flex-col items-center gap-4 flex-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20"
                          : "bg-white border-black/5 text-[#0B1221]/10"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle2 size={18} strokeWidth={1.5} />
                      ) : (
                        <div
                          className={`w-2 h-2 rounded-full ${isActive ? "bg-white animate-pulse" : "bg-current"}`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-black tracking-[0.2em] uppercase transition-colors duration-700 ${isActive ? "text-blue-600" : "text-[#0B1221]/20"}`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Items */}
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                Order Items
              </h3>
              <div className="flex-1 h-px bg-black/5" />
            </div>

            <div className="space-y-6">
              {order.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="group flex items-center gap-6 p-5 rounded-[2.5rem] bg-gray-50/50 border border-black/[0.03] transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-black/5"
                >
                  <div className="relative w-20 h-20 bg-white rounded-[1.5rem] overflow-hidden border border-black/5 shrink-0 group-hover:scale-105 transition-transform duration-700">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">
                      Item 0{idx + 1}
                    </p>
                    <h4 className="text-sm font-black text-[#0B1221] uppercase tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[9px] font-black text-[#0B1221]/30 uppercase tracking-widest">
                        Size: {item.size}
                      </span>
                      <div className="w-1 h-1 bg-black/5 rounded-full" />
                      <span className="text-[9px] font-black text-[#0B1221]/30 uppercase tracking-widest">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-[#0B1221]/20 uppercase tracking-widest mb-1">
                      Price
                    </p>
                    <p className="text-sm font-black text-[#0B1221]">
                      {item.price}৳
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Info Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h3 className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                  Summary
                </h3>
                <div className="flex-1 h-px bg-black/5" />
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-blue-600 border border-black/5 group-hover:scale-110 transition-transform">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-[#0B1221]/30 uppercase tracking-widest mb-1">
                      Shipping Address
                    </h4>
                    <p className="text-[11px] text-[#0B1221] font-bold uppercase tracking-tight leading-relaxed">
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-green-600 border border-black/5">
                    <CreditCard size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-[#0B1221]/30 uppercase tracking-widest mb-1">
                      Payment Method
                    </h4>
                    <p className="text-[11px] text-[#0B1221] font-bold uppercase tracking-tight">
                      {order.paymentMethod}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl text-orange-500 border border-black/5">
                    <Calendar size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[9px] font-black text-[#0B1221]/30 uppercase tracking-widest mb-1">
                      Order Date
                    </h4>
                    <p className="text-[11px] text-[#0B1221] font-bold uppercase tracking-tight">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="hidden md:flex flex-col items-center justify-center p-8 rounded-[3rem] bg-gray-50/50 border border-black/[0.03] space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-600/5 flex items-center justify-center shadow-inner">
                <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black text-[#0B1221] uppercase tracking-[0.3em] mb-1">
                  Private & Secure
                </p>
                <p className="text-[8px] font-black text-[#0B1221]/20 uppercase tracking-widest">
                  Your data is safe
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-8 lg:p-12 border-t border-black/5 bg-gray-50/30 relative z-10">
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-1">
              <p className="text-[#0B1221]/40 text-[9px] font-black uppercase tracking-[0.5em]">
                Order Total
              </p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[8px] font-black text-[#0B1221]/30 uppercase tracking-widest leading-none">
                  Payment Verified
                </span>
              </div>
            </div>
            <span className="text-4xl font-black text-blue-600 tracking-tighter">
              {order.total}৳
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-glow w-full py-6 bg-[#0B1221] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] hover:bg-black transition-all shadow-2xl shadow-black/20"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

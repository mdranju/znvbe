"use client";

import { BackButton } from "@/components/common/BackButton";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Search } from "lucide-react";
import { useLazyTrackOrderQuery } from "@/src/store/api/orderApi";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { SITE_CONFIG } from "@/src/config/site";

export default function TrackOrderPage() {
  const [track, { isLoading: loading }] = useLazyTrackOrderQuery();
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrack = async () => {
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID");
      return;
    }
    setError("");
    setTrackingResult(null);
    try {
      const result = await track({ orderId }).unwrap();
      setTrackingResult(result);
      toast.success("Order Found", {
        description: "Status: " + result.status,
      });
    } catch (err: any) {
      toast.error("Track Failed", {
        description: err?.data?.message || "Order not found",
      });
    }
  };

  const steps = ["pending", "confirmed", "shipped", "delivered"];
  const currentStepIdx = trackingResult
    ? steps.indexOf(trackingResult.status?.toLowerCase())
    : -1;

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <div className="mb-12 flex items-center justify-between">
              <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-blue-600" />
                <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                  Logistics Tracking
                </p>
              </div>
            </div>

            <div className="glass-card bg-white p-10 lg:p-16 rounded-[4rem] border border-black/5 shadow-2xl shadow-black/5 animate-in slide-in-from-bottom-12 duration-1000 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

              <div className="relative z-10 mb-12">
                <h2 className="hero-display text-4xl tracking-tighter text-[#0B1221] uppercase mb-4">
                  Trace Order.
                </h2>
                <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest leading-loose max-w-md">
                  Enter your unique Order ID (e.g., ORD-XXXXXX) to see the current status of your shipment.
                </p>
              </div>

              {!trackingResult ? (
                <div className="space-y-10 relative z-10">
                  <div className="group space-y-3">
                    <label className={`text-[10px] font-black uppercase tracking-[0.4em] ml-4 transition-colors ${error ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}>
                      Order ID *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={orderId}
                            onChange={(e) => {
                                setOrderId(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="ORD-XXXXXX"
                            className={`w-full border rounded-[1.8rem] px-8 py-5 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold uppercase ${error ? "bg-red-50/20 border-red-500 text-red-600" : "bg-gray-50/50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
                        />
                        <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-[#0B1221]/10" size={20} />
                    </div>
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-4 mt-1.5 flex items-center gap-1.5"
                        >
                          <AlertCircle size={10} />
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleTrack}
                      disabled={loading}
                      className="btn-glow w-full bg-[#0B1221] text-white py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-2xl shadow-black/20 disabled:opacity-50"
                    >
                      {loading ? "Searching..." : "Track Now"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 relative z-10 animate-in fade-in duration-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">
                        Shipment Identified
                      </p>
                      <h3 className="text-xl font-black text-[#0B1221] tracking-tight">
                        {trackingResult.orderId}
                      </h3>
                    </div>
                    <button
                      onClick={() => setTrackingResult(null)}
                      className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest hover:text-blue-600"
                    >
                      New Search
                    </button>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="relative pt-8 pb-4">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(currentStepIdx / (steps.length - 1)) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-blue-600"
                      />
                    </div>
                    <div className="relative z-10 flex justify-between">
                      {steps.map((step, i) => (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full border-4 transition-colors duration-500 ${i <= currentStepIdx ? "bg-blue-600 border-blue-100" : "bg-white border-gray-100"}`}
                          />
                          <span
                            className={`text-[8px] font-black uppercase tracking-widest mt-4 ${i <= currentStepIdx ? "text-blue-600" : "text-gray-300"}`}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 rounded-3xl border border-black/5">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Purchase Summary
                      </span>
                      <span className="text-sm font-black text-[#0B1221]">
                        ৳{trackingResult.totalPrice}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {trackingResult.items?.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#0B1221] uppercase">{item.name}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{item.size} • {item.color} • x{item.quantity}</span>
                          </div>
                          <span className="text-[11px] font-black text-[#0B1221]">
                            ৳{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                      <div className="pt-4 mt-4 border-t border-black/5 flex justify-between">
                         <span className="text-[10px] font-black text-gray-400 uppercase">Subtotal</span>
                         <span className="text-[10px] font-black text-[#0B1221]">৳{trackingResult.totalPrice - trackingResult.shippingCost}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-[10px] font-black text-gray-400 uppercase">Shipping</span>
                         <span className="text-[10px] font-black text-[#0B1221]">৳{trackingResult.shippingCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 text-center">
              <p className="text-[9px] font-black text-[#0B1221]/20 uppercase tracking-[0.4em] leading-relaxed">
                {SITE_CONFIG.name} Authenticity Guaranteed <br />
                Global Courier Service Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

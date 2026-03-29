"use client";
import { BackButton } from "@/components/common/BackButton";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";

export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderId: "", email: "" });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.orderId.trim()) errors.orderId = "Order ID is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTrack = () => {
    if (validateForm()) {
      setLoading(true);
      // Simulate tracking
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const renderError = (field: string) => (
    <AnimatePresence>
      {validationErrors[field] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-4 mt-1.5 flex items-center gap-1.5"
        >
          <AlertCircle size={10} />
          {validationErrors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32">
      {/* 1. Track Order Hero */}
      <div className="relative h-[35vh] lg:h-[45vh] flex items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Find Your Order
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            Track Order.
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
              See where your items are
            </span>
            <div className="h-6 w-px bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-2xl">
            <div className="mb-12 flex items-center justify-between">
              <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
              <div className="flex items-center gap-4">
                <div className="w-8 h-px bg-blue-600" />
                <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                  Online Tracking
                </p>
              </div>
            </div>

            <div className="glass-card bg-white p-10 lg:p-16 rounded-[4rem] border border-black/5 shadow-2xl shadow-black/5 animate-in slide-in-from-bottom-12 duration-1000 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />

              <div className="relative z-10 mb-12">
                <h2 className="hero-display text-4xl tracking-tighter text-[#0B1221] uppercase mb-4">
                  Track Your Order.
                </h2>
                <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest leading-loose max-w-md">
                  Enter your order ID and the email address used during checkout
                  to track your items.
                </p>
              </div>

              <form className="space-y-10 relative z-10" noValidate onSubmit={(e) => { e.preventDefault(); handleTrack(); }}>
                <div className="group space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-[0.4em] ml-4 transition-colors ${validationErrors.orderId ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}>
                    Order ID *
                  </label>
                  <input
                    type="text"
                    value={form.orderId}
                    onChange={(e) => handleInputChange("orderId", e.target.value)}
                    placeholder="Found in your confirmation email."
                    className={`w-full border rounded-[1.8rem] px-8 py-5 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold ${validationErrors.orderId ? "bg-red-50/20 border-red-500 text-red-600" : "bg-gray-50/50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
                  />
                  {renderError("orderId")}
                </div>

                <div className="group space-y-3">
                  <label className={`text-[10px] font-black uppercase tracking-[0.4em] ml-4 transition-colors ${validationErrors.email ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="The email used during checkout."
                    className={`w-full border rounded-[1.8rem] px-8 py-5 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold ${validationErrors.email ? "bg-red-50/20 border-red-500 text-red-600" : "bg-gray-50/50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
                  />
                  {renderError("email")}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-glow w-full bg-[#0B1221] text-white py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-2xl shadow-black/20 disabled:opacity-50"
                  >
                    {loading ? "Tracking..." : "Track Now"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-12 text-center">
              <p className="text-[9px] font-black text-[#0B1221]/20 uppercase tracking-[0.4em] leading-relaxed">
                Secure Delivery Tracking <br />
                Managed by Believers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

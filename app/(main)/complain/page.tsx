"use client";

import { BackButton } from "@/components/common/BackButton";
import { useState } from "react";
import { MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { complaintApi } from "@/src/services/api";

export default function ComplainPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    type: "Product Issue",
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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
    if (!form.name.trim()) errors.name = "Your name is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format";
    }
    if (!form.message.trim()) errors.message = "Please describe your issue";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            orderNumber: form.orderId,
            issueType: form.type,
            message: form.message
        };
        await complaintApi.submit(payload);
        setSubmitted(true);
      } catch (error) {
        console.error("Complaint error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderError = (field: string) => (
    <AnimatePresence>
      {validationErrors[field] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-red-500 text-[10px] font-black uppercase tracking-widest pl-4 mt-2 flex items-center gap-1.5"
        >
          <AlertCircle size={10} />
          {validationErrors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/30 to-[#0B1221] opacity-80" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60" />

        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <p className="text-amber-500 text-[10px] sm:text-xs font-black tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Resolution
          </p>
          <h1 className="hero-display text-4xl md:text-6xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Complaint Box.
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="flex items-center justify-center gap-4 mb-12 bg-amber-50/50 py-5 rounded-3xl border border-amber-100">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm">
              <MessageSquare size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[#0B1221] font-bold text-sm tracking-tight leading-tight">
                We take every complaint seriously.
              </p>
              <p className="text-gray-500 text-xs font-medium mt-1">
                Our support team guarantees a response within 24 hours.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle
                  size={48}
                  className="text-green-500"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="hero-display text-3xl sm:text-4xl text-[#0B1221] mb-4">
                Complaint Submitted
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. A ticket has been created and we
                will update you via email shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 max-w-3xl mx-auto"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest pl-4 transition-colors ${validationErrors.name ? "text-red-500" : "text-gray-400"}`}
                  >
                    Your Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Full name"
                    className={`w-full px-6 py-4 rounded-2xl text-sm font-medium outline-none transition-all duration-300 ${validationErrors.name ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"}`}
                  />
                  {renderError("name")}
                </div>
                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest pl-4 transition-colors ${validationErrors.email ? "text-red-500" : "text-gray-400"}`}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    className={`w-full px-6 py-4 rounded-2xl text-sm font-medium outline-none transition-all duration-300 ${validationErrors.email ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"}`}
                  />
                  {renderError("email")}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="Optional"
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                    Order ID
                  </label>
                  <input
                    value={form.orderId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, orderId: e.target.value }))
                    }
                    placeholder="If applicable"
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                  Complaint Type *
                </label>
                <div className="relative">
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, type: e.target.value }))
                    }
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-[#0B1221] outline-none focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none"
                  >
                    <option>Product Defect or Quality</option>
                    <option>Delivery Delay or Problem</option>
                    <option>Wrong Item Received</option>
                    <option>Payment & Refund Issue</option>
                    <option>Customer Service Feedback</option>
                    <option>Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-gray-400">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  className={`text-[10px] font-black uppercase tracking-widest pl-4 transition-colors ${validationErrors.message ? "text-red-500" : "text-gray-400"}`}
                >
                  Describe Your Issue *
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please describe what went wrong in detail..."
                  className={`w-full px-6 py-4 rounded-2xl text-sm font-medium outline-none transition-all duration-300 resize-none ${validationErrors.message ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"}`}
                />
                {renderError("message")}
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto md:px-14 bg-amber-500 text-white py-4 sm:py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors hover:shadow-xl hover:shadow-amber-500/20 mx-auto block max-w-sm disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

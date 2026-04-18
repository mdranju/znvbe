"use client";

import { BackButton } from "@/components/common/BackButton";
import { useState } from "react";
import {
  Users,
  TrendingUp,
  Gift,
  CheckCircle,
  ChevronDown,
  Rocket,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { affiliateApi } from "@/src/services/api";
import { premiumToast as toast } from "@/components/ui/PremiumToast";

interface FormState {
  name: string;
  email: string;
  phone: string;
  platform: string;
  followers: string;
}

const BENEFITS = [
  {
    icon: TrendingUp,
    title: "Earn Commission",
    desc: "Earn up to 10% commission on every sale you refer through your unique link.",
  },
  {
    icon: Users,
    title: "Grow Together",
    desc: "Join an elite community of affiliates and grow your income with our brand.",
  },
  {
    icon: Gift,
    title: "Exclusive Rewards",
    desc: "Get access to VIP deals, pre-launch products, and top-performer bonuses.",
  },
];

const FAQS = [
  {
    q: "How do I get my affiliate link?",
    a: "After application approval, your unique affiliate dashboard link will be emailed to you within 2–3 business days.",
  },
  {
    q: "When do I get paid?",
    a: "Commissions are processed monthly via bKash or Bank Transfer with a low minimum payout threshold of 500৳.",
  },
  {
    q: "Who can become an affiliate?",
    a: "Whether you're a content creator, blogger, or a loyal customer with a strong network, anyone can join and earn.",
  },
];

export default function AffiliatePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    platform: "",
    followers: "",
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
    if (!form.name.trim()) errors.name = "Full name is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        await affiliateApi.apply(form);
        setSubmitted(true);
        toast.success("Application Sent", {
          description: "We'll review your profile soon.",
        });
      } catch (error) {
        toast.error("Error", { description: "Failed to submit application." });
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
          className="text-red-500 text-[10px] font-bold uppercase tracking-widest pl-4 mt-2 flex items-center gap-1.5"
        >
          <AlertCircle size={10} />
          {validationErrors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative h-[45vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-[#0B1221] opacity-80" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />

        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-6 animate-in slide-in-from-top-4 duration-700 backdrop-blur-md">
            <Rocket size={14} /> Partner Program
          </div>
          <h1 className="hero-display text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Join & Earn.
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 -mt-16 sm:-mt-24 relative z-20">
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-[2rem] p-8 shadow-xl shadow-black/[0.02] border border-black/5 group hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                <Icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-black text-[#0B1221] uppercase tracking-tight mb-3">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] sm:rounded-[4rem] border border-black/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-14 lg:p-20 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          {submitted ? (
            <div className="text-center py-16 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                <CheckCircle
                  size={48}
                  className="text-green-500"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="hero-display text-3xl sm:text-4xl text-[#0B1221] mb-4 uppercase tracking-tighter">
                Application Received
              </h2>
              <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                Welcome to the pipeline! We will review your profile and email
                you your unique dashboard link within 2–3 business days.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="hero-display text-3xl sm:text-4xl text-[#0B1221] tracking-tighter">
                  Apply Now
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  Takes less than 2 minutes to complete.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-3xl mx-auto"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className={`text-[10px] font-black uppercase tracking-widest pl-4 transition-colors ${validationErrors.name ? "text-red-500" : "text-[#0B1221]/40"}`}
                    >
                      Full Name *
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="e.g. John Doe"
                      className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-medium outline-none transition-all duration-300 ${validationErrors.name ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                    />
                    {renderError("name")}
                  </div>
                  <div className="space-y-2">
                    <label
                      className={`text-[10px] font-black uppercase tracking-widest pl-4 transition-colors ${validationErrors.email ? "text-red-500" : "text-[#0B1221]/40"}`}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="your@email.com"
                      className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-medium outline-none transition-all duration-300 ${validationErrors.email ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                    />
                    {renderError("email")}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      className={`text-[10px] font-black uppercase tracking-widest pl-4 transition-colors ${validationErrors.phone ? "text-red-500" : "text-[#0B1221]/40"}`}
                    >
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="01XXXXXXXXX"
                      className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-medium outline-none transition-all duration-300 ${validationErrors.phone ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50/50 border-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                    />
                    {renderError("phone")}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest pl-4">
                      Primary Platform
                    </label>
                    <input
                      value={form.platform}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, platform: e.target.value }))
                      }
                      placeholder="Facebook / YouTube / Instagram"
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest pl-4">
                    Audience Size
                  </label>
                  <input
                    value={form.followers}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, followers: e.target.value }))
                    }
                    placeholder="Approximate followers or reach"
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto md:px-14 bg-indigo-600 text-white py-4 sm:py-5 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20 hover:-translate-y-1 transition-all mx-auto block max-w-sm disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 border border-black/5">
          <h2 className="text-xl sm:text-2xl font-black text-[#0B1221] uppercase tracking-tighter mb-8 flex items-center gap-4">
            <span className="w-6 h-1 bg-indigo-500 rounded-full" />
            Affiliate FAQ
          </h2>
          <div className="grid gap-4">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="group bg-gray-50/50 border border-black/5 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md hover:bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-sm sm:text-base font-bold text-[#0B1221] text-left outline-none"
                >
                  <span className="group-hover:text-indigo-600 transition-colors">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${openFaq === i ? "bg-indigo-500 text-white" : "bg-white border border-black/5 text-gray-400 group-hover:border-indigo-200"}`}
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6 text-sm font-medium text-gray-500 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

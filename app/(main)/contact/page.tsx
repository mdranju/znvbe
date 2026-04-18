"use client";

import { BackButton } from "@/components/common/BackButton";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import { contactApi } from "@/src/services/api";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { SITE_CONFIG } from "@/src/config/site";

const CONTACT_INFO = [
  {
    icon: Phone,
    label: "Call Us",
    value: "09638-090000",
    href: "tel:09638090000",
  },
  {
    icon: Mail,
    label: "Email Us",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Mohakhali DOHS, Dhaka",
    href: null,
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Sat–Thu: 10AM–9PM",
    href: null,
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactApi.submit(form);
      setSubmitted(true);
      toast.success("Message Sent", {
        description: "We'll get back to you soon.",
      });
    } catch (error) {
      toast.error("Error", { description: "Failed to send message." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/30 to-[#0B1221] opacity-80" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60" />

        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <p className="text-cyan-400 text-[10px] sm:text-xs font-black tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Reach Out
          </p>
          <h1 className="hero-display text-4xl md:text-6xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Contact Us.
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl shadow-black/[0.03] border border-black/5 text-center group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <Icon size={20} strokeWidth={1.5} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="text-sm font-bold text-[#0B1221] hover:text-cyan-600 transition-colors break-words"
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm font-bold text-[#0B1221] break-words">
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-black/5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 sm:p-14 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
          {submitted ? (
            <div className="text-center py-16 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle
                  size={48}
                  className="text-green-500"
                  strokeWidth={1.5}
                />
              </div>
              <h2 className="hero-display text-4xl text-[#0B1221] mb-4">
                Message Sent!
              </h2>
              <p className="text-gray-500 text-lg max-w-sm mx-auto">
                We&apos;ll get back to you within 24 hours. Thank you for
                reaching out.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="hero-display text-3xl sm:text-4xl text-[#0B1221]">
                  Send a Message
                </h2>
              </div>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      Your Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="contact@example.com"
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="Optional"
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                      Subject *
                    </label>
                    <input
                      required
                      value={form.subject}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, subject: e.target.value }))
                      }
                      placeholder="How can we help?"
                      className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-4">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Write your message here..."
                    className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto md:px-14 bg-[#0B1221] text-white py-4 sm:py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-cyan-600 transition-colors hover:shadow-xl hover:shadow-cyan-600/20 mx-auto block disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

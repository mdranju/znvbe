"use client";

import { BackButton } from "@/components/common/BackButton";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { profileActions } from "@/lib/data";
import {
  AlertCircle,
  ChevronRight,
  Edit3,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const [showForm, setShowForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const user = {
    name: "Md. Ranju",
    email: "mdranju.dev@gmail.com",
    phone: "01799301290",
    address: "Mohakhali, Dhaka - 1212",
  };

  const [form, setForm] = useState({ ...user });

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
    if (!form.address.trim()) errors.address = "Address is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      toast.success("Profile Updated", {
        description: "Your account information has been saved successfully.",
      });
      setShowForm(false);
    } else {
      toast.warning("Validation Failed", {
        description: "Please correct the errors in the form before saving.",
      });
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
      {/* 1. Profile Hero */}
      <div className="relative h-[20vh] lg:h-[30vh]  flex items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Account Details
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            {form.name}
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
              Member Status: Gold
            </span>
            <div className="h-6 w-px bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start relative">
          <ProfileSidebar />

          <div className="flex-1 w-full relative space-y-12">
            <div className="flex items-center justify-between mb-8">
              <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="p-3 bg-white border border-black/5 text-[#0B1221]/20 hover:text-blue-600 hover:border-blue-500/20 rounded-2xl transition-all duration-500 flex items-center gap-3"
                >
                  <Edit3 size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Edit Profile
                  </span>
                </button>
              )}
            </div>

            {/* Mobile/Tablet Quick Actions (Glass Grid) */}
            {!showForm && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-blue-600" />
                  <h2 className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                    Quick Actions
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.name}
                        href={action.href}
                        className={`group relative glass-card p-8 rounded-[2.5rem] border border-black/5 bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl shadow-md/5 hover:shadow-black/5 hover:-translate-y-2 flex flex-col items-start ${
                          action.mobileOnly ? "lg:hidden" : ""
                        }`}
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 mb-6 ${action.bg} ${action.color} group-hover:scale-110 group-hover:shadow-2xl`}
                        >
                          <Icon size={24} strokeWidth={1.5} />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-black text-[#0B1221] tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                            {action.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#0B1221]/20 group-hover:text-[#0B1221]/40 transition-colors">
                              Open
                            </span>
                            <ChevronRight
                              size={14}
                              className="text-[#0B1221]/10 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-500"
                            />
                          </div>
                        </div>

                        {/* Subtle background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
                      </Link>
                    );
                  })}
                  <button className="group relative glass-card p-8 rounded-[2.5rem] border border-red-500/10 bg-red-50/10 transition-all duration-500 hover:bg-red-50 hover:shadow-2xl shadow-md/5 hover:shadow-red-500/5 hover:-translate-y-2 text-left cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white text-red-500 flex items-center justify-center shadow-sm mb-6 group-hover:scale-110">
                      <LogOut size={24} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-black text-red-600 tracking-tight uppercase">
                        Log Out
                      </h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-red-300">
                        Sign out of your account
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Redesigned Edit Profile Section (Glass-Card) */}
            {showForm && (
              <div className="glass-card rounded-[3.5rem] border border-black/5 bg-white p-10 lg:p-16 animate-in slide-in-from-bottom-12 duration-700 shadow-2xl shadow-black/5">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                  <div>
                    <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                      Edit Profile Info
                    </p>
                    <h2 className="hero-display text-4xl lg:text-5xl tracking-tighter text-[#0B1221]">
                      Profile Settings.
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] hover:text-blue-700 transition-colors border-b border-blue-600/20 pb-1"
                  >
                    Cancel
                  </button>
                </div>

                <form
                  className="space-y-10"
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="group space-y-3">
                      <label
                        className={`text-[10px] font-black uppercase tracking-[0.4em] ml-4 transition-colors ${validationErrors.name ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                      >
                        Full Name *
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ${validationErrors.name ? "text-red-500" : "text-[#0B1221]/10 group-focus-within:text-blue-600"}`}
                          strokeWidth={1.5}
                        />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Your full name"
                          className={`w-full border rounded-[1.8rem] pl-16 pr-8 py-5 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold ${validationErrors.name ? "bg-red-50/20 border-red-500 text-red-600" : "bg-gray-50/50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
                        />
                      </div>
                      {renderError("name")}
                    </div>

                    <div className="group space-y-3">
                      <label
                        className={`text-[10px] font-black uppercase tracking-[0.4em] ml-4 transition-colors ${validationErrors.phone ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                      >
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone
                          size={18}
                          className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ${validationErrors.phone ? "text-red-500" : "text-[#0B1221]/10 group-focus-within:text-blue-600"}`}
                          strokeWidth={1.5}
                        />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="Your phone number"
                          className={`w-full border rounded-[1.8rem] pl-16 pr-8 py-5 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold ${validationErrors.phone ? "bg-red-50/20 border-red-500 text-red-600" : "bg-gray-50/50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
                        />
                      </div>
                      {renderError("phone")}
                    </div>
                  </div>

                  <div className="group space-y-3">
                    <label
                      className={`text-[10px] font-black uppercase tracking-[0.4em] ml-4 transition-colors ${validationErrors.email ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ${validationErrors.email ? "text-red-500" : "text-[#0B1221]/10 group-focus-within:text-blue-600"}`}
                        strokeWidth={1.5}
                      />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Your email address"
                        className={`w-full border rounded-[1.8rem] pl-16 pr-8 py-5 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold ${validationErrors.email ? "bg-red-50/20 border-red-500 text-red-600" : "bg-gray-50/50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
                      />
                    </div>
                    {renderError("email")}
                  </div>

                  <div className="group space-y-3">
                    <label
                      className={`text-[10px] font-black uppercase tracking-[0.4em] ml-4 transition-colors ${validationErrors.address ? "text-red-500" : "text-[#0B1221]/40 group-focus-within:text-blue-600"}`}
                    >
                      Home Address *
                    </label>
                    <div className="relative">
                      <MapPin
                        size={18}
                        className={`absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ${validationErrors.address ? "text-red-500" : "text-[#0B1221]/10 group-focus-within:text-blue-600"}`}
                        strokeWidth={1.5}
                      />
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Your physical home address"
                        className={`w-full border rounded-[1.8rem] pl-16 pr-8 py-5 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold ${validationErrors.address ? "bg-red-50/20 border-red-500 text-red-600" : "bg-gray-50/50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
                      />
                    </div>
                    {renderError("address")}
                  </div>

                  <div className="pt-8 flex flex-col sm:flex-row gap-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="btn-glow px-12 py-5 bg-blue-600 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-10 py-5 border border-black/5 text-[#0B1221]/40 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

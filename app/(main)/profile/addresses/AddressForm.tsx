import { AnimatePresence } from "motion/react";
import React, { useState } from "react";

import { Address } from "@/hooks/useAddresses";
import { DISTRICTS } from "@/lib/data";
import {
  AlertCircle,
  Briefcase,
  Check,
  ChevronDown,
  Home,
  MapPin,
} from "lucide-react";
import { motion } from "motion/react";

type AddressFormData = Omit<Address, "id">;

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: AddressFormData;
  onSave: (data: AddressFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AddressFormData>(initial);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const set = (key: keyof AddressFormData, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.street.trim()) errors.street = "Street address is required";
    if (!form.city.trim()) errors.city = "City is required";
    if (!form.district.trim()) errors.district = "District is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";

    if (form.email?.trim() && !/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "Invalid email format";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    onSave(form);
  };

  const renderError = (field: string) => (
    <AnimatePresence>
      {validationErrors[field] && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5"
        >
          <AlertCircle size={10} />
          {validationErrors[field]}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Label Buttons */}
      <div>
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
          Address Group
        </label>
        <div className="flex gap-3">
          {["Home", "Office", "Other"].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => set("label", l)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                form.label === l
                  ? "bg-[#0B1221] text-white border-[#0B1221] shadow-xl"
                  : "bg-white border-black/5 text-[#0B1221]/40 hover:border-black/10 hover:text-[#0B1221]"
              }`}
            >
              {l === "Home" ? (
                <Home size={14} />
              ) : l === "Office" ? (
                <Briefcase size={14} />
              ) : (
                <MapPin size={14} />
              )}
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label
            className={`block text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.firstName ? "text-red-500" : "text-gray-400"}`}
          >
            First Name *
          </label>
          <input
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="First name"
            className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-bold outline-none border transition-all duration-300 ${validationErrors.firstName ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
          />
          {renderError("firstName")}
        </div>
        <div className="space-y-1.5">
          <label
            className={`block text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.lastName ? "text-red-500" : "text-gray-400"}`}
          >
            Last Name *
          </label>
          <input
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Last name"
            className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-bold outline-none border transition-all duration-300 ${validationErrors.lastName ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
          />
          {renderError("lastName")}
        </div>
      </div>

      {/* Street */}
      <div className="space-y-1.5">
        <label
          className={`block text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.street ? "text-red-500" : "text-gray-400"}`}
        >
          Street / House No. *
        </label>
        <input
          value={form.street}
          onChange={(e) => set("street", e.target.value)}
          placeholder="House number and street name"
          className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-bold outline-none border transition-all duration-300 ${validationErrors.street ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
        />
        {renderError("street")}
      </div>
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
          Apartment / Suite{" "}
          <span className="lowercase font-bold opacity-30 italic">
            (optional)
          </span>
        </label>
        <input
          value={form.apartment}
          onChange={(e) => set("apartment", e.target.value)}
          placeholder="Apartment, suite, unit, etc."
          className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-[1.25rem] text-sm font-bold text-[#0B1221] outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all duration-300"
        />
      </div>

      {/* City + District + Postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label
            className={`block text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.city ? "text-red-500" : "text-gray-400"}`}
          >
            City / Town *
          </label>
          <input
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="City"
            className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-bold outline-none border transition-all duration-300 ${validationErrors.city ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
          />
          {renderError("city")}
        </div>
        <div className="space-y-1.5">
          <label
            className={`block text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.district ? "text-red-500" : "text-gray-400"}`}
          >
            District *
          </label>
          <div className="relative">
            <select
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-bold outline-none border appearance-none transition-all duration-300 ${validationErrors.district ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
            >
              <option value="" disabled>
                Select a district...
              </option>
              {DISTRICTS.map((d) => (
                <option key={d.value}>
                  {d.name} ({d.bn})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
          {renderError("district")}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
            Postal Code{" "}
            <span className="lowercase font-bold opacity-30 italic">
              (optional)
            </span>
          </label>
          <input
            value={form.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            placeholder="Postal code"
            className="w-full px-6 py-4 bg-gray-50 border border-black/5 rounded-[1.25rem] text-sm font-bold text-[#0B1221] outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all duration-300"
          />
        </div>
        <div className="space-y-1.5">
          <label
            className={`block text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.phone ? "text-red-500" : "text-gray-400"}`}
          >
            Phone Number *
          </label>
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="01XXXXXXXXX"
            type="tel"
            className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-bold outline-none border transition-all duration-300 ${validationErrors.phone ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
          />
          {renderError("phone")}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          className={`block text-[10px] font-black uppercase tracking-widest ml-4 transition-colors ${validationErrors.email ? "text-red-500" : "text-gray-400"}`}
        >
          Email Address{" "}
          <span className="lowercase font-bold opacity-30 italic">
            (optional)
          </span>
        </label>
        <input
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="Email address for order updates"
          type="email"
          className={`w-full px-6 py-4 rounded-[1.25rem] text-sm font-bold outline-none border transition-all duration-300 ${validationErrors.email ? "bg-red-50/20 border-red-500 text-red-600 focus:bg-white" : "bg-gray-50 border-black/5 text-[#0B1221] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20"}`}
        />
        {renderError("email")}
      </div>

      {/* Default toggle */}
      <div
        className="flex items-center gap-4 group p-4 bg-gray-50/50 border border-black/5 rounded-[1.5rem] cursor-pointer"
        onClick={() => set("isDefault", !form.isDefault)}
      >
        <div
          className={`w-12 h-6 rounded-full transition-all duration-500 relative ${form.isDefault ? "bg-blue-600" : "bg-gray-200"}`}
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-500 ${form.isDefault ? "translate-x-6" : ""}`}
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/60">
          Set as primary delivery address
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="submit"
          className="flex-1 bg-[#0B1221] text-white h-16 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all duration-500 flex items-center justify-center gap-3 shadow-2xl shadow-black/10 active:scale-[0.98]"
        >
          <Check size={16} /> Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-10 h-16 border border-black/5 text-[#0B1221]/40 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-50 transition-all duration-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddressForm;

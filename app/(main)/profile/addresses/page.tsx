"use client";

import { useState } from "react";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { BackButton } from "@/components/common/BackButton";
import { useAddresses, Address } from "@/hooks/useAddresses";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Star,
  StarOff,
  Home,
  Briefcase,
  X,
  Check,
} from "lucide-react";

type AddressFormData = Omit<Address, "id">;

const EMPTY_FORM: AddressFormData = {
  label: "Home",
  firstName: "",
  lastName: "",
  street: "",
  apartment: "",
  city: "",
  district: "Dhaka",
  postalCode: "",
  phone: "",
  isDefault: false,
};

const DISTRICTS = [
  "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
  "Barishal", "Mymensingh", "Rangpur", "Comilla", "Gazipur",
  "Narayanganj", "Tangail", "Faridpur", "Jessore", "Cox's Bazar",
];

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
  const set = (key: keyof AddressFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.phone) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Label Buttons */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          Address Label
        </label>
        <div className="flex gap-3">
          {["Home", "Office", "Other"].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => set("label", l)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                form.label === l
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {l === "Home" ? <Home size={14} /> : l === "Office" ? <Briefcase size={14} /> : <MapPin size={14} />}
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">First Name *</label>
          <input
            required
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Last Name *</label>
          <input
            required
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Last name"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Street */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Street / House No. *</label>
        <input
          required
          value={form.street}
          onChange={(e) => set("street", e.target.value)}
          placeholder="House number and street name"
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Apartment / Suite <span className="font-normal">(optional)</span></label>
        <input
          value={form.apartment}
          onChange={(e) => set("apartment", e.target.value)}
          placeholder="Apartment, suite, unit, etc."
          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* City + District + Postal */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">City / Town *</label>
          <input
            required
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="City"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">District *</label>
          <select
            required
            value={form.district}
            onChange={(e) => set("district", e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Postal Code <span className="font-normal">(optional)</span></label>
          <input
            value={form.postalCode}
            onChange={(e) => set("postalCode", e.target.value)}
            placeholder="Postal code"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1.5">Phone *</label>
          <input
            required
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="01XXXXXXXXX"
            type="tel"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Default toggle */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          onClick={() => set("isDefault", !form.isDefault)}
          className={`w-11 h-6 rounded-full transition-colors relative ${form.isDefault ? "bg-blue-600" : "bg-gray-200"}`}
        >
          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isDefault ? "translate-x-5" : ""}`} />
        </div>
        <span className="text-sm font-bold text-gray-700">Set as default address</span>
      </label>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Check size={16} /> Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3.5 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefault } = useAddresses();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = (data: AddressFormData) => {
    addAddress(data);
    setShowForm(false);
  };

  const handleEdit = (id: string, data: AddressFormData) => {
    updateAddress(id, data);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this address?")) deleteAddress(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProfileSidebar />

        <div className="flex-1 w-full">
          <BackButton className="mb-4" />

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                <MapPin size={22} />
              </div>
              <h1 className="text-2xl font-black text-gray-900">My Addresses</h1>
            </div>
            {!showForm && (
              <button
                onClick={() => { setShowForm(true); setEditingId(null); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} /> Add New
              </button>
            )}
          </div>

          {/* Add new form */}
          {showForm && (
            <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-gray-900">New Address</h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={18} />
                </button>
              </div>
              <AddressForm
                initial={EMPTY_FORM}
                onSave={handleAdd}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {/* Address Cards */}
          {addresses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <MapPin size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold">No saved addresses</p>
              <p className="text-sm mt-1">Add an address to speed up checkout</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address.id}>
                  {editingId === address.id ? (
                    <div className="bg-white rounded-3xl border border-blue-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-black text-gray-900">Edit Address</h2>
                        <button onClick={() => setEditingId(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                          <X size={18} />
                        </button>
                      </div>
                      <AddressForm
                        initial={{ ...address }}
                        onSave={(data) => handleEdit(address.id, data)}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  ) : (
                    <div className={`bg-white rounded-3xl border p-5 shadow-sm transition-all ${address.isDefault ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`p-2.5 rounded-xl flex-shrink-0 ${address.isDefault ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                            {address.label === "Home" ? <Home size={18} /> : address.label === "Office" ? <Briefcase size={18} /> : <MapPin size={18} />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-black text-gray-900">{address.label}</span>
                              {address.isDefault && (
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Default</span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-gray-700">
                              {address.firstName} {address.lastName}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {address.street}{address.apartment ? `, ${address.apartment}` : ""}, {address.city}, {address.district}
                              {address.postalCode ? ` - ${address.postalCode}` : ""}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5">{address.phone}</p>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefault(address.id)}
                              title="Set as default"
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <StarOff size={16} />
                            </button>
                          )}
                          {address.isDefault && (
                            <div className="p-2 text-blue-500">
                              <Star size={16} />
                            </div>
                          )}
                          <button
                            onClick={() => { setEditingId(address.id); setShowForm(false); }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

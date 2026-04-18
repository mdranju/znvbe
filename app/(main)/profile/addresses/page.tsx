"use client";

import { BackButton } from "@/components/common/BackButton";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Address, useAddresses } from "@/hooks/useAddresses";
import {
  Briefcase,
  Edit3,
  Home,
  MapPin,
  Plus,
  Star,
  StarOff,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import AddressForm from "./AddressForm";
import { CustomAlert } from "@/components/ui/CustomAlert";

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
  email: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefault } =
    useAddresses();
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

  const [deleteAlert, setDeleteAlert] = useState<{isOpen: boolean; id: string | null}>({isOpen: false, id: null});

  const confirmDelete = () => {
    if (deleteAlert.id) deleteAddress(deleteAlert.id);
  };

  const handleDelete = (id: string) => {
    setDeleteAlert({ isOpen: true, id });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32 pt-10">
      {/* 1. Addresses Hero */}
      <div className="relative h-[20vh] lg:h-[30vh] flex lg:hidden items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Address Book
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            My Addresses.
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
              Manage your delivery locations
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
                  onClick={() => {
                    setShowForm(true);
                    setEditingId(null);
                  }}
                  className="p-4 bg-white border border-black/5 text-[#0B1221]/20 hover:text-blue-600 hover:border-blue-500/20 rounded-2xl transition-all duration-500 flex items-center gap-3 group"
                >
                  <Plus
                    size={18}
                    className="transition-transform duration-500 group-hover:rotate-180"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Add New Address
                  </span>
                </button>
              )}
            </div>

            {/* Redesigned Address Management Form (Glass-Card) */}
            {showForm && (
              <div className="glass-card rounded-[3.5rem] border border-blue-500/10 bg-white p-10 lg:p-16 animate-in slide-in-from-bottom-12 duration-700 shadow-2xl shadow-blue-500/5">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                  <div>
                    <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                      Add Address
                    </p>
                    <h2 className="hero-display text-4xl lg:text-5xl tracking-tighter text-[#0B1221]">
                      New Address.
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
                  >
                    <X size={20} className="text-[#0B1221]/20" />
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
              <div className="text-center py-40 glass-card rounded-[3.5rem] bg-white border border-black/5 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8">
                  <MapPin
                    size={32}
                    className="text-[#0B1221]/10"
                    strokeWidth={1}
                  />
                </div>
                <h3 className="hero-display text-3xl tracking-tighter text-[#0B1221] mb-2 uppercase">
                  No Addresses Found
                </h3>
                <p className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                  Add a delivery location to complete your orders faster.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                {addresses.map((address, idx) => (
                  <div
                    key={address.id}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700  shadow-md/5 hover:shadow-none rounded-[3rem]"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {editingId === address.id ? (
                      <div className="glass-card rounded-[3rem] border border-blue-500/20 bg-white p-10 shadow-2xl shadow-blue-500/5">
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="text-sm font-black text-[#0B1221] tracking-tight uppercase">
                            Edit Address
                          </h2>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 hover:bg-gray-50 rounded-xl"
                          >
                            <X size={16} className="text-[#0B1221]/20" />
                          </button>
                        </div>
                        <AddressForm
                          initial={{ ...address }}
                          onSave={(data) => handleEdit(address.id, data)}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
                    ) : (
                      <div
                        className={`group relative glass-card p-10 rounded-[3rem] border transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 ${address.isDefault ? "border-blue-600/20 bg-white ring-1 ring-blue-600/5" : "border-black/5 bg-white"}`}
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex items-start gap-6 flex-1 min-w-0">
                            <div
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-700 group-hover:scale-110 group-hover:shadow-2xl ${address.isDefault ? "bg-blue-600 text-white shadow-blue-500/20 shadow-xl" : "bg-gray-50 text-[#0B1221]/20 shadow-sm"}`}
                            >
                              {address.label === "Home" ? (
                                <Home size={22} strokeWidth={1.5} />
                              ) : address.label === "Office" ? (
                                <Briefcase size={22} strokeWidth={1.5} />
                              ) : (
                                <MapPin size={22} strokeWidth={1.5} />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-[0.4em] ${address.isDefault ? "text-blue-600" : "text-[#0B1221]/40"}`}
                                >
                                  {address.label} Address
                                </span>
                                {address.isDefault && (
                                  <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/5 border border-blue-600/10 rounded-full animate-pulse">
                                    <div className="w-1 h-1 bg-blue-600 rounded-full" />
                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">
                                      Default
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-lg font-black tracking-tighter text-[#0B1221] mb-2">
                                {address.firstName} {address.lastName}
                              </p>
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-[#0B1221]/60 leading-relaxed uppercase tracking-tight">
                                  {address.street}
                                  {address.apartment
                                    ? `, ${address.apartment}`
                                    : ""}
                                  , <br />
                                  {address.city}, {address.district}{" "}
                                  {address.postalCode &&
                                    `- ${address.postalCode}`}
                                </p>
                                <p className="text-[10px] font-black tracking-[0.2em] text-[#0B1221]/20 uppercase pt-2">
                                  Phone: {address.phone}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Overlay */}
                        <div className="mt-8 pt-8 border-t border-black/5 flex items-center justify-between">
                          <div className="flex gap-4">
                            {!address.isDefault && (
                              <button
                                onClick={() => setDefault(address.id)}
                                className="text-[10px] font-black uppercase tracking-widest text-blue-600/40 hover:text-blue-600 transition-colors flex items-center gap-2"
                              >
                                <StarOff size={14} /> Set as Default
                              </button>
                            )}
                            {address.isDefault && (
                              <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                <Star size={14} fill="currentColor" /> Default
                                Address
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingId(address.id);
                                setShowForm(false);
                              }}
                              className="p-3 bg-gray-50 text-[#0B1221]/20 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(address.id)}
                              className="p-3 bg-red-50/50 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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

      <CustomAlert
        isOpen={deleteAlert.isOpen}
        title="Delete Address"
        message="Are you sure you want to remove this delivery location from your book?"
        type="danger"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, id: null })}
      />
    </div>
  );
}

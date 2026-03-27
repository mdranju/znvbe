"use client";

import { clearCart } from "@/src/store/slices/cartSlice";
import { RootState } from "@/src/store/store";
import { useAddresses, Address } from "@/hooks/useAddresses";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import {
  MapPin,
  Home,
  Briefcase,
  Plus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DISTRICTS } from "@/lib/data";

export default function CheckoutPage() {
  const { items: cartItems, totalPrice } = useSelector(
    (state: RootState) => state.cart,
  );
  const [shippingCost, setShippingCost] = useState(60);
  const dispatch = useDispatch();
  const router = useRouter();

  const { addresses, defaultAddress } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [showSavedAddresses, setShowSavedAddresses] = useState(true);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Controlled form state
  const selectedAddress = selectedAddressId
    ? (addresses.find((a) => a.id === selectedAddressId) ?? defaultAddress)
    : defaultAddress;

  const [form, setForm] = useState({
    firstName: selectedAddress?.firstName ?? "",
    lastName: selectedAddress?.lastName ?? "",
    street: selectedAddress?.street ?? "",
    apartment: selectedAddress?.apartment ?? "",
    city: selectedAddress?.city ?? "",
    district: selectedAddress?.district ?? "Dhaka",
    postalCode: selectedAddress?.postalCode ?? "",
    phone: selectedAddress?.phone ?? "",
    email: "",
    notes: "",
  });

  const applyAddress = (address: Address) => {
    setSelectedAddressId(address.id);
    setUseNewAddress(false);
    setForm((f) => ({
      ...f,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      apartment: address.apartment ?? "",
      city: address.city,
      district: address.district,
      postalCode: address.postalCode ?? "",
      phone: address.phone,
    }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Cart is Empty", {
        description:
          "Please add items to your cart before proceeding to checkout.",
      });
      return;
    }

    setIsProcessing(true);

    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const orderData = {
      orderId,
      items: cartItems,
      subtotal: totalPrice,
      shipping: shippingCost,
      total: totalPrice + shippingCost,
      paymentMethod: "Cash on delivery",
      shippingAddress: `${form.street}, ${form.city}, ${form.district}`,
      date: new Date().toISOString(),
    };

    // Simulate premium processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    sessionStorage.setItem("lastOrder", JSON.stringify(orderData));
    dispatch(clearCart());

    toast.success("Order Confirmed! 🎉", {
      description:
        "Your order has been placed successfully. We'll notify you soon.",
    });

    router.push("/thank-you");
  };

  // State: Processing Order (Modern Summary UI)
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="w-full max-w-lg relative z-10 space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-black/5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] backdrop-blur-3xl text-center">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-600/10 border-t-blue-600 animate-spin" />
              <CheckCircle2
                size={40}
                className="text-blue-600/20"
                strokeWidth={1.5}
              />
            </div>

            <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
              Secure Checkout
            </p>
            <h2 className="hero-display text-4xl lg:text-5xl tracking-tighter text-[#0B1221] mb-6">
              Processing Order.
            </h2>
            <p className="text-[#0B1221]/40 text-sm font-medium leading-relaxed max-w-[280px] mx-auto mb-10">
              Hang tight! We are finalizing your secure payment and updating
              your inventory.
            </p>

            <div className="pt-8 border-t border-black/5 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40">
                <span>Order Subtotal</span>
                <span className="text-[#0B1221]">৳{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40">
                <span>Shipping Charges</span>
                <span className="text-[#0B1221]">৳{shippingCost}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-[#0B1221] pt-2">
                <span className="uppercase tracking-[0.2em] text-[10px]">
                  Total Balance
                </span>
                <span className="text-xl">৳{totalPrice + shippingCost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State: Empty Checkout (Premium UI)
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="glass-card p-12 lg:p-16 rounded-[3rem] border border-black/5 bg-white shadow-2xl shadow-black/5 max-w-lg relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-black/5">
            <CheckCircle2
              size={32}
              className="text-[#0B1221]/10"
              strokeWidth={1.5}
            />
          </div>

          <h2 className="hero-display text-4xl tracking-tighter text-[#0B1221] mb-4">
            Checkout is Empty.
          </h2>
          <p className="text-[#0B1221]/40 text-sm font-medium leading-relaxed mb-12 max-w-[280px] mx-auto">
            It looks like you haven&apos;t added any luxury items to your cart
            yet. Let&apos;s change that.
          </p>

          <Link
            href="/products"
            className="w-full inline-flex items-center justify-center bg-[#0B1221] text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 py-12 lg:py-20">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <form
          onSubmit={handlePlaceOrder}
          className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start"
        >
          {/* Section 01: Shipping details */}
          <div className="w-full lg:w-3/5 space-y-12">
            <div>
              <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                Section 01
              </p>
              <h2 className="hero-display text-4xl lg:text-5xl tracking-tighter text-[#0B1221]">
                Shipping Details.
              </h2>
            </div>

            {/* ── Saved Address Manager ── */}
            {addresses.length > 0 && (
              <div className="glass-card rounded-[2.5rem] border border-black/5 bg-white/40 backdrop-blur-3xl overflow-hidden p-2 shadow-2xl shadow-black/5">
                <button
                  type="button"
                  onClick={() => setShowSavedAddresses((v) => !v)}
                  className="w-full flex items-center justify-between px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/40 hover:text-[#0B1221] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <MapPin size={16} strokeWidth={1.5} />
                    Saved Addresses
                  </span>
                  {showSavedAddresses ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {showSavedAddresses && (
                  <div className="px-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    {addresses.map((address) => {
                      const isSelected =
                        !useNewAddress &&
                        (selectedAddressId === address.id ||
                          (!selectedAddressId && address.isDefault));
                      return (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => applyAddress(address)}
                          className={`w-full text-left flex items-start gap-4 p-5 rounded-[1.8rem] border-2 transition-all duration-500 ${
                            isSelected
                              ? "border-blue-600 bg-white shadow-xl shadow-blue-500/5 ring-8 ring-blue-500/5"
                              : "border-transparent bg-white/50 hover:bg-white hover:border-black/5"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white border border-black/5 text-[#0B1221]/40"}`}
                          >
                            {address.label === "Home" ? (
                              <Home size={18} strokeWidth={1.5} />
                            ) : address.label === "Office" ? (
                              <Briefcase size={18} strokeWidth={1.5} />
                            ) : (
                              <MapPin size={18} strokeWidth={1.5} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center gap-3 mb-1.5">
                              <span className="text-sm font-black text-[#0B1221] tracking-tight">
                                {address.label}
                              </span>
                              {address.isDefault && (
                                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-[#0B1221]/60 truncate">
                              {address.street}, {address.city}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2
                              size={24}
                              className="text-blue-600 shrink-0 mt-2"
                              strokeWidth={1.5}
                            />
                          )}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        setUseNewAddress(true);
                        setSelectedAddressId(null);
                        setForm((f) => ({
                          ...f,
                          firstName: "",
                          lastName: "",
                          street: "",
                          apartment: "",
                          city: "",
                          district: "Dhaka",
                          postalCode: "",
                          phone: "",
                        }));
                      }}
                      className={`w-full flex items-center justify-center gap-3 p-5 rounded-[1.8rem] border-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                        useNewAddress
                          ? "border-blue-600 bg-white text-blue-600 shadow-xl shadow-blue-500/5 ring-8 ring-blue-500/5"
                          : "border-dashed border-black/10 text-[#0B1221]/20 hover:border-blue-500/30 hover:text-blue-600"
                      }`}
                    >
                      <Plus size={16} strokeWidth={2} />
                      Add New Address
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Billing Form ── */}
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group space-y-2.5">
                  <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 group-focus-within:text-blue-600 transition-colors">
                    First Name *
                  </label>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    placeholder="Enter First Name"
                    type="text"
                    className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl focus:shadow-black/5"
                  />
                </div>
                <div className="group space-y-2.5">
                  <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 group-focus-within:text-blue-600 transition-colors">
                    Last Name *
                  </label>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    placeholder="Enter Last Name"
                    type="text"
                    className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl focus:shadow-black/5"
                  />
                </div>
              </div>

              <div className="group space-y-2.5">
                <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 group-focus-within:text-blue-600 transition-colors">
                  Country / Region *
                </label>
                <div className="relative">
                  <select className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl appearance-none">
                    <option>Bangladesh</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[#0B1221]/20 pointer-events-none"
                  />
                </div>
              </div>

              <div className="group space-y-2.5">
                <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 group-focus-within:text-blue-600 transition-colors">
                  Street Address *
                </label>
                <div className="space-y-4">
                  <input
                    required
                    value={form.street}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, street: e.target.value }))
                    }
                    type="text"
                    placeholder="House number and street name"
                    className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl"
                  />
                  <input
                    value={form.apartment}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, apartment: e.target.value }))
                    }
                    type="text"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group space-y-2.5">
                  <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 group-focus-within:text-blue-600 transition-colors">
                    Town / City *
                  </label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    placeholder="Enter City"
                    type="text"
                    className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl"
                  />
                </div>
                <div className="group space-y-2.5">
                  <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 group-focus-within:text-blue-600 transition-colors">
                    District *
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={form.district}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, district: e.target.value }))
                      }
                      className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl appearance-none"
                    >
                      <option value="" selected disabled>
                        Select a district...
                      </option>
                      {DISTRICTS.map((d) => (
                        <option key={d.value}>
                          {d.name} ({d.bn})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-[#0B1221]/20 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              <div className="group space-y-2.5">
                <label className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 group-focus-within:text-blue-600 transition-colors">
                  Contact Information *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="Phone Number"
                    type="tel"
                    className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl"
                  />
                  <input
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="Email Address"
                    type="email"
                    className="w-full bg-white border border-black/5 rounded-[1.5rem] px-6 py-4 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl"
                  />
                </div>
              </div>

              <div className="group space-y-2.5 pt-8">
                <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.3em] ml-4 mb-4">
                  Section 02 / Additional Information
                </p>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-[#0B1221] tracking-tight ml-4">
                    Order Notes
                  </label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    placeholder="Indicate any specific instructions for the delivery team."
                    className="w-full bg-white border border-black/5 rounded-[2rem] px-8 py-6 outline-none transition-all duration-500 placeholder:text-[#0B1221]/10 text-sm font-bold text-[#0B1221] focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500/20 focus:shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Review Column: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="glass-card p-10 lg:p-12 rounded-[3.5rem] border border-black/5 bg-white/70 backdrop-blur-3xl shadow-2xl shadow-black/5 lg:sticky lg:top-32">
              <div className="mb-10 text-center lg:text-left">
                <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4">
                  Section 02
                </p>
                <h2 className="hero-display text-4xl tracking-tighter text-[#0B1221]">
                  Order Summary.
                </h2>
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center px-4 pb-4 border-b border-black/5">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
                    Item
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
                    Price
                  </span>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar px-2">
                  {cartItems.map((item, idx) => (
                    <div
                      key={`${item.id}-${item.size}-${idx}`}
                      className="group flex justify-between items-center gap-6 p-4 rounded-3xl hover:bg-white transition-all duration-500 border border-transparent hover:border-black/5"
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-2xl shrink-0 border border-black/5 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black tracking-tight text-[#0B1221] line-clamp-1">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-blue-600">
                              × {item.quantity}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/30">
                              Size: {item.size}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-black text-[#0B1221] shrink-0">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-black/5">
                <div className="flex justify-between items-center px-4 text-sm font-bold text-[#0B1221]">
                  <span className="opacity-40 uppercase tracking-widest text-[10px] font-black">
                    Subtotal
                  </span>
                  <span>৳{totalPrice}</span>
                </div>

                <div className="px-4 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30 block mb-2">
                    Shipping Method
                  </span>
                  <div className="grid grid-cols-1 gap-4">
                    <label
                      className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-500 cursor-pointer ${shippingCost === 60 ? "border-blue-600 bg-white ring-4 ring-blue-500/5" : "border-black/5 bg-gray-50/50 grayscale opacity-40 hover:opacity-100 hover:grayscale-0"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${shippingCost === 60 ? "bg-blue-600 text-white" : "bg-white text-gray-400"}`}
                        >
                          <CheckCircle2 size={18} strokeWidth={2} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Inside Dhaka
                        </span>
                      </div>
                      <span className="text-sm font-black">৳60</span>
                      <input
                        type="radio"
                        name="shipping"
                        className="hidden"
                        checked={shippingCost === 60}
                        onChange={() => setShippingCost(60)}
                      />
                    </label>

                    <label
                      className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all duration-500 cursor-pointer ${shippingCost === 120 ? "border-blue-600 bg-white ring-4 ring-blue-500/5" : "border-black/5 bg-gray-50/50 grayscale opacity-40 hover:opacity-100 hover:grayscale-0"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${shippingCost === 120 ? "bg-blue-600 text-white" : "bg-white text-gray-400"}`}
                        >
                          <CheckCircle2 size={18} strokeWidth={2} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Outside Dhaka
                        </span>
                      </div>
                      <span className="text-sm font-black">৳120</span>
                      <input
                        type="radio"
                        name="shipping"
                        className="hidden"
                        checked={shippingCost === 120}
                        onChange={() => setShippingCost(120)}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-end px-4 py-8 bg-[#0B1221] rounded-[2.5rem] mt-10 shadow-2xl shadow-black/20">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                      Total Amount
                    </span>
                    <span className="hero-display text-4xl tracking-tighter text-white">
                      ৳{totalPrice + shippingCost}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <CheckCircle2
                      size={24}
                      className="text-blue-500 mb-2"
                      strokeWidth={1.5}
                    />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest px-2.5 py-1.5 border border-white/10 rounded-full bg-white/5">
                      Cash on Delivery
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-glow w-full bg-blue-600 text-white py-6 rounded-[2.2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] mt-8 flex items-center justify-center gap-4"
                >
                  Place Order
                  <div className="w-5 h-px bg-white/30" />
                </button>

                <p className="text-[9px] font-medium text-center text-[#0B1221]/30 uppercase tracking-[0.2em] px-8 leading-relaxed mt-4">
                  Orders are processed and dispatched from our warehouse. <br />{" "}
                  Secure checkout active.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

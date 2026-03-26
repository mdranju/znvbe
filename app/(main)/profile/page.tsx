"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { BackButton } from "@/components/common/BackButton";
import {
  User,
  ShoppingBag,
  Lock,
  Settings,
  LogOut,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Edit3,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  const [showForm, setShowForm] = useState(false);

  const profileActions = [
    {
      name: "My Orders",
      href: "/profile/orders",
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "My Addresses",
      href: "/profile/addresses",
      icon: MapPin,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      name: "Change Password",
      href: "/profile/password",
      icon: Lock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      name: "Settings",
      href: "/profile/settings",
      icon: Settings,
      color: "text-gray-600",
      bg: "bg-gray-100",
      mobileOnly: true,
    },
  ];

  const user = {
    name: "Md. Ranju",
    email: "mdranju.dev@gmail.com",
    phone: "01799301290",
    address: "Mohakhali, Dhaka - 1212",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start relative">
        <ProfileSidebar />

        <div className="flex-1 w-full relative">
          <BackButton className="mb-" />
          {/* Mobile User Header */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 -z-10" />

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                <Image
                  src="https://picsum.photos/seed/user1/200/200"
                  alt="User Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h1 className="text-2xl font-black text-gray-900 mb-1">
                  {user.name}
                </h1>
                <p className="text-gray-500 font-medium mb-4">{user.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-blue-500" />
                    {user.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-blue-500" />
                    Dhaka, BD
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="mt-4 sm:mt-0 p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
              >
                <Edit3 size={20} />
              </button>
            </div>
          </div>

          {!showForm ? (
            /* Quick Action Grid/List for Mobile */
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all hover:shadow-md ${
                        action.mobileOnly ? "lg:hidden" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 ${action.bg} ${action.color} rounded-xl transition-transform group-hover:scale-110`}
                        >
                          <Icon size={24} />
                        </div>
                        <span className="font-bold text-gray-900">
                          {action.name}
                        </span>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all"
                      />
                    </Link>
                  );
                })}
                <button className="bg-red-50 p-5 rounded-2xl border border-red-100 flex items-center justify-between group hover:bg-red-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-red-600 rounded-xl">
                      <LogOut size={24} />
                    </div>
                    <span className="font-bold text-red-600">Logout</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Personal Details Form */
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Details
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Cancel
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                    Home Address
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Enter your address"
                      defaultValue={user.address}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-black text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

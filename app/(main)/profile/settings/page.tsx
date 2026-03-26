"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { BackButton } from "@/components/common/BackButton";
import {
  ChevronRight,
  User,
  ShoppingBag,
  Lock,
  Users,
  MessageSquare,
  Info,
  ShieldCheck,
  FileText,
  RefreshCcw,
  Phone,
  HelpCircle,
  MapPin,
  Settings as SettingsIcon,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const sections = [
    {
      title: "Account",
      items: [
        { name: "Personal Details", href: "/profile", icon: User },
        { name: "My Orders", href: "/profile/orders", icon: ShoppingBag },
        { name: "My Addresses", href: "/profile/addresses", icon: MapPin },
        { name: "Change Password", href: "/profile/password", icon: Lock },
        { name: "Join As Affiliate", href: "/affiliate", icon: Users },
        { name: "Complain Box", href: "/complain", icon: MessageSquare },
      ],
    },
    {
      title: "Information",
      items: [
        { name: "About Us", href: "/about", icon: Info },
        { name: "Privacy Policy", href: "/privacy", icon: ShieldCheck },
        { name: "Terms & Conditions", href: "/terms", icon: FileText },
        { name: "Refund & Returned", href: "/refund", icon: RefreshCcw },
      ],
    },
    {
      title: "Support / Talk to Us",
      items: [
        { name: "Contact Us", href: "/contact", icon: Phone },
        { name: "Help Center", href: "/help", icon: HelpCircle },
        { name: "Our Showrooms", href: "/store-locations", icon: MapPin },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <ProfileSidebar />

        <div className="flex-1 w-full relative">
          <BackButton className="mb-" />
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <SettingsIcon size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-3">
                  {section.title}
                </h2>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="divide-y divide-gray-50">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                              <Icon size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
                              {item.name}
                            </span>
                          </div>
                          <ChevronRight
                            size={18}
                            className="text-gray-300 group-hover:text-gray-400 transition-colors"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {/* Support Highlight Card */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Our support team is available 24/7 to help you with your
                queries.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:09638090000"
                  className="flex-1 min-w-[140px] bg-white text-blue-600 py-3 px-4 rounded-xl text-sm font-bold text-center hover:bg-blue-50 transition-colors"
                >
                  Call Support
                </a>
                <a
                  href="mailto:cc.believerssign@gmail.com"
                  className="flex-1 min-w-[140px] bg-blue-700 text-white py-3 px-4 rounded-xl text-sm font-bold text-center hover:bg-blue-800 transition-colors"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

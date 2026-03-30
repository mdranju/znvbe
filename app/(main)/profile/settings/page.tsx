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
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32">
      {/* 1. Settings Hero */}
      <div className="relative h-[35vh] lg:h-[45vh] flex items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />
        
        <div className="relative z-10 text-center px-6">
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Account Control
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            Settings.
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
             <div className="h-6 w-px bg-white/20" />
             <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
                 Manage your account and preferences
             </span>
             <div className="h-6 w-px bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start relative">
          <ProfileSidebar />

          <div className="flex-1 w-full relative space-y-20">
            <div className="flex items-center justify-between">
                <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-blue-600" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
                      Standard settings v1.8
                  </p>
                </div>
            </div>

            <div className="space-y-24">
              {sections.map((section, sIdx) => (
                <div key={section.title} className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${sIdx * 200}ms` }}>
                  <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.5em]">
                      {section.title}
                    </h2>
                    <div className="flex-1 h-px bg-black/5" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {section.items.map((item, iIdx) => {
                       const Icon = item.icon;
                       return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="group relative glass-card p-8 rounded-[2.5rem] border border-black/5 bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 flex flex-col items-start"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-[#0B1221]/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-2xl transition-all duration-700">
                            <Icon size={24} strokeWidth={1.5} />
                          </div>
                          
                          <div className="space-y-1">
                              <h3 className="text-sm font-black text-[#0B1221] tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-[#0B1221]/20 group-hover:text-[#0B1221]/40 transition-colors">
                                      Open
                                  </span>
                                  <ChevronRight size={14} className="text-[#0B1221]/10 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-500" />
                              </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Support Highlight Card */}
              <div className="relative glass-card p-12 lg:p-20 rounded-[4rem] bg-[#0B1221] overflow-hidden group shadow-2xl shadow-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                    <div className="shrink-0">
                        <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-2xl">
                            <SettingsIcon size={40} className="text-white animate-spin-slow" strokeWidth={1} />
                        </div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-500/20 rounded-full">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Support is Online</span>
                        </div>
                        <h3 className="hero-display text-4xl lg:text-5xl tracking-tighter text-white uppercase">Need Help?</h3>
                        <p className="text-sm font-bold text-white/40 leading-relaxed max-w-xl">
                            Our support team is available 24/7 to help you with any questions or issues you may have.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
                        <a
                            href="tel:09638090000"
                            className="px-10 py-5 bg-blue-600 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-700 transition-all text-center shadow-2xl shadow-blue-500/20"
                        >
                            Call Us
                        </a>
                        <a
                            href="mailto:contact@avlorawear.com"
                            className="px-10 py-5 bg-white/10 border border-white/10 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/20 transition-all text-center backdrop-blur-3xl"
                        >
                            Email Us
                        </a>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

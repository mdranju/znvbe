'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, Lock, LogOut, Settings, MapPin } from 'lucide-react';

export function ProfileSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'My Orders', href: '/profile/orders', icon: ShoppingBag },
    { name: 'Addresses', href: '/profile/addresses', icon: MapPin },
    { name: 'Change Password', href: '/profile/password', icon: Lock },
    { name: 'Settings', href: '/profile/settings', icon: Settings, mobileOnly: true },
    { name: 'Logout', href: '#', icon: LogOut, isDanger: true },
  ];

  return (
    <div className="w-full md:w-80 shrink-0 hidden md:block">
      <div className="glass-card rounded-[2.5rem] border border-black/5 bg-white/90 backdrop-blur-3xl overflow-hidden sticky top-32 shadow-2xl shadow-black/5 p-4">
        <div className="px-6 py-8 border-b border-black/5 mb-4">
          <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-2">
            Member Area
          </p>
          <h3 className="hero-display text-2xl tracking-tighter text-[#0B1221]">
            Account Menu.
          </h3>
        </div>
        
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name} className={item.mobileOnly ? 'lg:hidden' : ''}>
                <Link 
                  href={item.href}
                  className={`flex items-center justify-between px-6 py-4.5 rounded-[1.5rem] transition-all duration-500 group ${
                    isActive 
                      ? 'text-blue-600 bg-white shadow-xl shadow-blue-500/5 ring-8 ring-blue-500/5' 
                      : item.isDanger 
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-[#0B1221]/40 hover:text-[#0B1221] hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={18} className={`transition-all duration-500 ${isActive ? 'text-blue-600 scale-110' : 'group-hover:text-[#0B1221] group-hover:scale-110'}`} strokeWidth={isActive ? 2 : 1.5} />
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                        {item.name}
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

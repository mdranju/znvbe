'use client';

import { X, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/lib/data';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  // Define subcategories for Panjabi as an example based on the screenshot
  const panjabiSubcategories = [
    { name: 'Superior Panjabi', slug: 'superior-panjabi' },
    { name: 'As-Shabab', slug: 'as-shabab' },
    { name: 'Gracious Panjabi', slug: 'gracious-panjabi' },
    { name: 'Semi Luxury', slug: 'semi-luxury' },
    { name: 'chikankar', slug: 'chikankar' },
    { name: 'Platinum', slug: 'platinum' },
    { name: 'Elegent', slug: 'elegent' },
    { name: 'Printed', slug: 'printed' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
    <div 
        className={`fixed top-0 left-0 h-full w-full max-w-[320px] bg-[#0B1221] z-[100] transform transition-transform duration-700 ease-out flex flex-col lg:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: Brand Identity */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-[#0B1221]/80 backdrop-blur-xl">
          <Link href="/" onClick={onClose} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20 group-active:scale-90 transition-transform">
              b
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white leading-none">
                Believers.
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-0.5">
                Collection
              </span>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content: Immersive Navigation */}
        <div className="flex-1 overflow-y-auto py-8 px-6 custom-scrollbar space-y-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 px-2">
              Departments
            </p>
            <ul className="space-y-1">
              {categories.map((category) => {
                const hasSubcategories = category.slug === "panjabi";
                const isExpanded = expandedCategories[category.slug];

                return (
                  <li key={category.id} className="group">
                    <div className="flex items-center justify-between rounded-2xl transition-all duration-300 group-hover:bg-white/5">
                      <Link 
                        href={`/products?category=${category.slug}`}
                        onClick={onClose}
                        className={`flex-1 px-4 py-3.5 font-bold text-sm tracking-tight transition-colors ${isExpanded ? "text-blue-500" : "text-white/70 group-hover:text-white"}`}
                      >
                        {category.name}
                      </Link>
                      
                      {hasSubcategories && (
                        <button 
                          onClick={() => toggleCategory(category.slug)}
                          className={`p-3 mr-1 rounded-xl transition-all ${isExpanded ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-white/20 hover:text-white hover:bg-white/5"}`}
                        >
                          <ChevronDown size={14} className={`transition-transform duration-500 ${isExpanded ? "" : "-rotate-90"}`} />
                        </button>
                      )}
                    </div>
                    
                    {/* Seamless Subcategory Reveal */}
                    {hasSubcategories && isExpanded && (
                      <ul className="mt-2 ml-4 pl-4 border-l border-white/5 space-y-1 animate-in fade-in slide-in-from-left-4 duration-500">
                        {panjabiSubcategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={`/products?category=${sub.slug}`}
                              onClick={onClose}
                              className="block px-4 py-2.5 text-xs font-bold text-white/40 hover:text-blue-400 transition-colors uppercase tracking-widest"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 px-2">
              Support
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: "Track Order", href: "/track-order" },
                { name: "Store Finder", href: "/store-locations" },
                { name: "Profile Settings", href: "/profile/settings" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="px-6 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white hover:bg-blue-600 transition-all shadow-xl shadow-black/10 border border-white/5"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Legal & Versioning */}
        <div className="p-8 border-t border-white/5 bg-[#0B1221]/80 backdrop-blur-xl">
           <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                 App Version 2.0.4
              </span>
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">
                 Secure Build
              </span>
           </div>
           <p className="text-[9px] font-medium text-white/30 leading-relaxed">
              &copy; 2026 Believers Group. <br /> All rights reserved.
           </p>
        </div>
      </div>
    </>
  );
}

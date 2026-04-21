"use client";

import { X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetCategoriesQuery, useGetSubcategoriesQuery } from "@/src/store/api/categoryApi";
import { useCMS } from "@/src/hooks/useCMS";
import Image from "next/image";
import { SITE_CONFIG } from "@/src/config/site";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { metadata, getImageUrl } = useCMS();
  const { data: categoriesData = [] } = useGetCategoriesQuery({});
  const { data: allSubcategories = [] } = useGetSubcategoriesQuery({ status: "active" });

  const dynamicCategories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as any)?.result || [];
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const categoriesToRender =
    dynamicCategories.length > 0
      ? dynamicCategories.filter((c: any) => c.status === "active" && c.showInHeader === true)
      : [];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[1000] transition-opacity lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[320px] bg-[#0B1221] z-[1010] transform transition-transform duration-700 ease-out flex flex-col lg:hidden shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header: Brand Identity */}
        <div className="flex items-center justify-between p-8 border-b border-white/5 bg-[#0B1221]/80 backdrop-blur-xl">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            <div className="rounded-2xl flex items-center justify-center group-active:scale-90 transition-transform">
              <Image
                src={
                  metadata?.logo
                    ? getImageUrl(metadata.logo)
                    : "/white-logo.svg"
                }
                alt={`${SITE_CONFIG.name} Logo`}
                width={40}
                height={40}
                className="w-full h-10 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              />
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
            <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em] mb-8 px-2 animate-pulse">
              Make Your Mark
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6 px-2">
              Departments
            </p>
            <ul className="space-y-1">
              {categoriesToRender.map((category: any) => {
                const categorySubcategories = allSubcategories.filter(sub => 
                  (sub.category?._id || sub.category?.id || sub.category) === category._id
                );
                const hasSubcategories = categorySubcategories.length > 0;
                const isExpanded = expandedCategories[category.slug];

                return (
                  <li key={category._id || category.id} className="group">
                    <div className="flex items-center justify-between rounded-2xl transition-all duration-300 group-hover:bg-white/5">
                      <Link
                        href={`/category/${category.slug}`}
                        onClick={onClose}
                        className={`flex-1 px-4 py-3.5 font-bold text-sm tracking-tight transition-colors ${
                          isExpanded
                            ? "text-blue-500"
                            : "text-white/80 group-hover:text-white"
                        }`}
                      >
                        {category.name}
                      </Link>

                      {hasSubcategories && (
                        <button
                          onClick={() => toggleCategory(category.slug)}
                          className={`p-3 mr-1 rounded-xl transition-all ${
                            isExpanded
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                              : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-500 ${isExpanded ? "" : "-rotate-90"}`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Seamless Subcategory Reveal */}
                    {hasSubcategories && isExpanded && (
                      <ul className="mt-2 ml-4 pl-4 border-l border-white/5 space-y-1 animate-in fade-in slide-in-from-left-4 duration-500">
                        {categorySubcategories.map((sub: any) => (
                          <li key={sub._id || sub.id}>
                            <Link
                              href={`/category/${category.slug}?subcategory=${sub.slug}`}
                              onClick={onClose}
                              className="block px-4 py-2.5 text-xs font-bold text-white/60 hover:text-blue-400 transition-colors uppercase tracking-widest"
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
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6 px-2">
              Support
            </p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { name: "Track Order", href: "/track-order" },
                { name: "Profile Settings", href: "/profile/settings" },
                { name: "Complain Box", href: "/complain" },
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
            <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
              App Version 2.0.4
            </span>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">
              Secure Build
            </span>
          </div>
          <p className="text-[9px] font-medium text-white/40 leading-relaxed">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. <br /> All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

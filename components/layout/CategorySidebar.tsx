"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CategorySidebarProps {
  categories: any[];
  currentSlug: string;
  currentSubcategory?: string;
}

export function CategorySidebar({ categories, currentSlug, currentSubcategory }: CategorySidebarProps) {
  const [expandedCats, setExpandedCats] = useState<string[]>(() => {
    // Expand current category by default
    const current = categories.find(c => c.slug === currentSlug);
    return current ? [current._id || current.id] : [];
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-8 h-px bg-blue-600" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B1221]">
            Categories
          </h3>
        </div>
        <ul className="space-y-3">
          {categories.map((cat) => {
            const isCatActive = currentSlug === cat.slug;
            const hasSubs = cat.subcategories && cat.subcategories.length > 0;
            const isExpanded = expandedCats.includes(cat._id || cat.id);

            return (
              <li key={cat.slug} className="space-y-3">
                <div className="flex items-center justify-between group">
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`flex-1 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                      isCatActive && !currentSubcategory
                        ? "text-blue-600"
                        : "text-[#0B1221]/40 hover:text-[#0B1221]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                  
                  {hasSubs && (
                    <button 
                      onClick={(e) => toggleExpand(cat._id || cat.id, e)}
                      className={`p-1 hover:bg-gray-100 rounded-md transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <ChevronDown size={14} className={isCatActive ? "text-blue-600" : "text-[#0B1221]/20"} />
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {hasSubs && isExpanded && (
                  <ul className="pl-4 space-y-2 border-l border-black/[0.03] ml-1">
                    {cat.subcategories.map((sub: any) => {
                      const isSubActive = currentSubcategory === sub.slug;
                      return (
                        <li key={sub.slug}>
                          <Link
                            href={`/category/${cat.slug}?subcategory=${sub.slug}`}
                            className={`block text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                              isSubActive
                                ? "text-blue-600"
                                : "text-[#0B1221]/20 hover:text-[#0B1221]/60"
                            }`}
                          >
                            — {sub.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

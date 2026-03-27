"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle open state: focus input and lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Small delay to ensure modal is rendered and transition started before focusing
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const saveSearch = (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) return;
    
    setRecentSearches((prev) => {
      // Remove if already exists to move to top
      const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
      const updated = [term, ...filtered].slice(0, 5); // Keep last 5
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      saveSearch(query);
      router.push(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  const clearSearchStr = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  // Filter products based on query
  const suggestions = query.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Search Header */}
      <div className="p-4 bg-white border-b border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <form onSubmit={handleSubmit} className="flex-1 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
              <Search size={18} className="text-[#0B1221]/40 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-black/5 rounded-[20px] focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 outline-none text-[15px] font-semibold text-[#0B1221] transition-all duration-300"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearchStr}
                className="absolute right-4 inset-y-0 flex items-center p-1 text-[#0B1221]/20 hover:text-[#0B1221] transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </form>
          <button
            onClick={onClose}
            className="text-[13px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Results / Discovery Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        {!query.trim() ? (
          <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">Recent Searches</h3>
                  <button 
                    onClick={() => {
                        localStorage.removeItem("recentSearches");
                        setRecentSearches([]);
                    }}
                    className="text-[9px] font-black uppercase tracking-widest text-red-500/60"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(term);
                        saveSearch(term);
                        router.push(`/products?search=${encodeURIComponent(term)}`);
                        onClose();
                      }}
                      className="px-5 py-2.5 bg-white border border-black/5 rounded-full text-[13px] font-bold text-[#0B1221] shadow-sm active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Clock size={14} className="text-[#0B1221]/20" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links / Suggestions */}
            <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30 px-1">Suggested for you</h3>
               <div className="grid grid-cols-2 gap-3">
                  {['New Arrivals', 'Best Sellers', 'Exclusive', 'On Sale'].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat.toLowerCase().replace(' ', '-')}`}
                      onClick={onClose}
                      className="p-4 bg-white border border-black/5 rounded-2xl flex flex-col gap-2 group hover:border-blue-500/20 hover:shadow-lg transition-all"
                    >
                      <span className="text-[13px] font-black text-[#0B1221]">{cat}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Browse →</span>
                    </Link>
                  ))}
               </div>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="bg-white p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 px-2">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">Matches Found</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={() => {
                    saveSearch(query);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-black/5"
                >
                  <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-black/5">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] text-[#0B1221] truncate mb-1">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-blue-600">
                        ৳{product.price}
                        </p>
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/20">In Stock</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="w-full mt-6 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white bg-[#0B1221] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
            >
              See all results for &quot;{query}&quot;
            </button>
          </div>
        ) : (
          <div className="px-6 py-20 text-center bg-white h-full flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-black/5 shadow-inner">
                <Search size={28} className="text-[#0B1221]/20" />
             </div>
            <p className="text-[#0B1221] font-bold text-lg mb-2 tracking-tighter">No items match your search</p>
            <p className="text-[#0B1221]/40 text-[13px] font-medium max-w-[200px]">Try different keywords or browse our categories.</p>
          </div>
        )}
      </div>
    </div>
  );
}

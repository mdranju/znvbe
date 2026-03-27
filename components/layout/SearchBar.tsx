"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data";

export function SearchBar({
  isMobile = false,
  scrolled,
  onFocusChange,
}: {
  isMobile?: boolean;
  scrolled: boolean;
  onFocusChange?: (focused: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync focus state to parent
  useEffect(() => {
    onFocusChange?.(isFocused);
  }, [isFocused, onFocusChange]);

  // Filter products based on query
  const suggestions = query.trim()
    ? products
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  return (
    <div
      className={`relative w-full ${!isMobile && "max-w-2xl mx-auto"} transition-all duration-700 ease-out ${isFocused && !isMobile ? "scale-[1.01]" : "scale-100"}`}
      ref={dropdownRef}
    >
      <form onSubmit={handleSubmit} className="relative w-full group">
        <div className={`absolute inset-y-0 left-5 flex items-center pointer-events-none transition-colors duration-500 z-10 ${isFocused ? "text-blue-600" : "text-[#0B1221]/40"}`}>
          <Search size={18} strokeWidth={2} />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsFocused(true);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder="Explore collections..."
          className={`w-full pl-14 pr-6 py-4 bg-gray-50 border border-black/5 rounded-2xl outline-none transition-all duration-500 placeholder:text-[#0B1221]/20 text-[#0B1221] font-semibold text-sm ${
            isFocused ? "bg-white ring-4 ring-blue-500/5 border-blue-500/20 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)]" : "hover:bg-[#0B1221]/5"
          }`}
        />

        {/* Dynamic Focus Glow */}
        <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 blur-[2px] transition-opacity duration-700 ${isFocused ? "opacity-100" : "group-hover:opacity-40"} pointer-events-none`} />
      </form>

      {/* Cinematic Suggestions Dropdown */}
      {isFocused && query.trim() && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white/95 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border border-black/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] backdrop-blur-3xl z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mb-4 px-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B1221]/30">
              Matches Found
            </p>
          </div>
          
          <div className="space-y-1">
            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={() => setIsFocused(false)}
                className="flex items-center gap-5 p-3 md:p-4 rounded-2xl md:rounded-3xl hover:bg-gray-50 transition-all duration-300 group"
              >
                <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-black/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-bold text-sm md:text-base text-[#0B1221] tracking-tighter truncate group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs font-black text-blue-600">
                      ৳{product.price}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/20">
                      In Stock
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white bg-[#0B1221] hover:bg-blue-600 transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
          >
            Explore All Results
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productApi } from "@/src/services/api";
import { useDebounce } from "@/src/hooks/useDebounce";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductImage } from "@/src/utils/image";

export const SearchBar = ({
  scrolled,
  onFocusChange,
}: {
  scrolled?: boolean;
  onFocusChange?: (focused: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
        onFocusChange?.(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onFocusChange]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 1) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await productApi.getAll({
          searchTerm: debouncedQuery,
          limit: 5,
        });
        const data = res.data?.data;
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setIsFocused(false);
      onFocusChange?.(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full group">
      <form onSubmit={handleSearch} className="relative z-[100]">
        <div
          className={`relative flex items-center transition-all duration-500 rounded-2xl overflow-hidden
          ${
            isFocused
              ? "bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.1),0_20px_50px_-12px_rgba(0,0,0,0.1)] ring-1 ring-blue-500"
              : "bg-gray-50/50 hover:bg-gray-100/80 border border-black/5"
          }
        `}
        >
          <div className="pl-5 text-gray-400">
            {isLoading ? (
              <div className="w-4 h-4 rounded-full bg-blue-500/20 animate-pulse border border-blue-500/10" />
            ) : (
              <Search size={18} strokeWidth={2} />
            )}
          </div>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none py-3.5 px-4 text-sm font-bold placeholder:text-gray-400 placeholder:font-medium text-[#0B1221]"
            placeholder="Search for premium streetwear..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              onFocusChange?.(true);
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
              className="pr-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestion Dropdown */}
      {isFocused && query.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-3 bg-white rounded-[2rem] border border-black/5 shadow-2xl shadow-black/10 overflow-hidden z-[99] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-2">
              {isLoading
                ? "Analyzing Archive..."
                : suggestions.length > 0
                  ? "Curated Matches"
                  : "No results found"}
            </h4>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-2.5">
                    <Skeleton className="w-14 h-14 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-2">
                {suggestions.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-gray-50 transition-all group"
                    onClick={() => {
                      setIsFocused(false);
                      onFocusChange?.(false);
                    }}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-black/5 bg-gray-50 shrink-0">
                      <OptimizedImage
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        context="thumbnail"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[#0B1221] truncate group-hover:text-blue-600 transition-colors uppercase">
                        {product.name}
                      </p>
                      <p className="text-xs font-bold text-blue-600 mt-0.5 uppercase tracking-widest">
                        ৳{product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : null}

            <Link
              href={`/products?search=${encodeURIComponent(query)}`}
              onClick={() => {
                setIsFocused(false);
                onFocusChange?.(false);
              }}
              className="mt-4 block w-full py-3 text-center bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all border border-dashed border-gray-200"
            >
              View all results for &quot;{query}&quot;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

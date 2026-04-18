"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  Loader2,
  ArrowRight,
  History,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productApi } from "@/src/services/api";
import { useDebounce } from "@/src/hooks/useDebounce";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getProductImage } from "@/src/utils/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    }
  }, []);

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

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      saveSearch(query);
      router.push(`/products?search=${encodeURIComponent(query)}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] lg:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0B1221]/80 backdrop-blur-xl"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute inset-x-0 bottom-0 top-0 bg-white shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-400" aria-label="Close search modal">
            <X size={24} />
          </button>
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search
              className="absolute left-0 top-1/2 -translate-y-1/2 text-blue-600"
              size={20}
            />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className="w-full pl-8 pr-10 py-2 bg-transparent text-xl font-bold placeholder:text-gray-200 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <History size={16} className="text-gray-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Past Explorations
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(term);
                      router.push(`/products?search=${term}`);
                      onClose();
                    }}
                    className="px-5 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-[#0B1221] hover:bg-gray-100 transition-all border border-black/5"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {query && (
            <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-blue-600" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {suggestions.length > 0 ? "Top Matches" : "No results found"}
                  </h3>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 border border-black/5 rounded-2xl animate-pulse">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-3/4 bg-gray-100 rounded" />
                          <div className="h-3 w-1/4 bg-gray-50 rounded" />
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
                      onClick={() => {
                        saveSearch(query);
                        onClose();
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-black/5"
                    >
                      <div className="relative w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-black/5">
                        <OptimizedImage
                          src={getProductImage(product)}
                          alt={product.name}
                          fill
                          context="thumbnail"
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
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/20">
                            {product.status === "active"
                              ? "In Stock"
                              : "Out of Stock"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : null}

              {suggestions.length > 0 && (
                <button
                  onClick={() => handleSearch()}
                  className="w-full mt-6 py-4 bg-[#0B1221] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                >
                  Show all archives
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

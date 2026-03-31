"use client";

import { use } from "react";
import { BackButton } from "@/components/common/BackButton";
import { products, categories } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const category = resolvedSearchParams.category?.toLowerCase() || "";
  const search = resolvedSearchParams.search?.toLowerCase() || "";

  // Filter products locally from dummy data
  let filteredProducts = products;

  if (category) {
    // Basic category matching, in real app, products would have a category field
    // For our data, we map based on what's available or just return all if it's "all".
    filteredProducts = filteredProducts.filter((p) =>
      p.slug.includes(category),
    );
  }

  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search),
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32">
      {/* 1. Discovery Hero */}
      <div className="relative h-[40vh] lg:h-[30vh] flex items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Browse Products
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            {search
              ? `Results: "${search}"`
              : category
                ? `${category}.`
                : "All Products."}
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
              {filteredProducts.length} Products Found
            </span>
            <div className="h-6 w-px bg-white/20" />
          </div>
        </div>

        {/* Decorative background depth */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8fafc]/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-blue-600" />
            <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
              All Items
            </p>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 w-full">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center glass-card bg-white rounded-[4rem] border border-black/5 shadow-2xl shadow-black/5">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-10 shadow-inner group overflow-hidden relative">
              <div className="absolute inset-0 bg-blue-600/5 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full" />
              <SearchX
                size={32}
                className="text-[#0B1221]/10 relative z-10"
                strokeWidth={1}
              />
            </div>
            <h2 className="hero-display text-4xl tracking-tighter text-[#0B1221] mb-4 uppercase">
              No Results.
            </h2>
            <p className="text-[10px] font-black text-[#0B1221]/30 mb-10 max-w-sm mx-auto uppercase tracking-widest leading-loose">
              We couldn&apos;t find any products matching your search or
              filters.
            </p>
            <Link
              href="/products"
              className="btn-glow px-12 py-5 bg-[#0B1221] text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-2xl shadow-black/20"
            >
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

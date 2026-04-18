"use client";
import { use, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/src/store/api/productApi";
import { BackButton } from "@/components/common/BackButton";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Pagination } from "@/components/dashboard/Pagination";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);

  // Also listen to live URL changes (e.g. after router.push from SearchBar)
  const liveParams = useSearchParams();
  const category = liveParams.get("category") || resolvedSearchParams.category || "";
  const search = liveParams.get("search") || resolvedSearchParams.search || "";

  const [page, setPage] = useState(Number(resolvedSearchParams.page) || 1);

  // Build query — only include non-empty params to avoid MongoDB empty-string matches
  const queryParams: Record<string, any> = { page, limit: 20 };
  if (search.trim()) queryParams.searchTerm = search.trim();
  if (category.trim()) queryParams.category = category.trim();

  const { data, isLoading } = useGetProductsQuery(queryParams);

  const products = data?.result || [];
  const meta = data?.meta || { page: 1, totalPage: 1, total: 0 };

  // Reset page when search or category changes, and scroll to top
  useEffect(() => {
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, search]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between mb-12">
          <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-blue-600" />
            <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
              {search ? `Searching "${search}"` : category ? `Category: ${category}` : "All Items"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 w-full">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-[2rem] aspect-[3/4] border border-black/5 shadow-sm"
                />
              ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 w-full mb-12">
              {products.map((product: any, idx: number) => (
                <div
                  key={product._id || product.id || idx}
                  className="animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <Pagination 
              currentPage={page}
              totalPages={meta.totalPage}
              onPageChange={setPage}
            />
          </>
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

"use client";

import { useGetCategoriesQuery } from "@/src/store/api/categoryApi";
import { BackButton } from "@/components/common/BackButton";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { resolveImageUrl } from "@/src/utils/image";
import { CollectionCardSkeleton } from "@/components/ui/SkeletonComponents";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useGetCategoriesQuery({ status: "active" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]/50">
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-10 lg:py-24">
          <div className="mb-20 space-y-4">
              <div className="h-10 w-32 bg-white rounded-full animate-pulse" />
              <div className="pt-4 space-y-4">
                  <div className="h-4 w-40 bg-blue-100 rounded-full animate-pulse" />
                  <div className="h-20 w-3/4 bg-gray-100 rounded-[2rem] animate-pulse" />
              </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {Array(8).fill(0).map((_, i) => (
              <CollectionCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-10 lg:py-24">
        <div className="mb-20 space-y-4">
            <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-blue-600 transition-all duration-300 shadow-sm" />
            <div className="pt-4">
                <p className="text-blue-600 text-[10px] font-black tracking-[0.6em] uppercase mb-4">Our Masterpieces</p>
                <h1 className="hero-display text-5xl lg:text-7xl xl:text-8xl tracking-tighter text-[#0B1221]">
                    The Collections.
                </h1>
            </div>
        </div>

        {categories.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-black/5 p-12 text-center">
            <p className="text-sm font-bold text-[#0B1221]/40 uppercase tracking-widest">No categories found yet.</p>
            <p className="text-xs text-[#0B1221]/20 mt-2">Our curators are preparing something special.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
            {categories.map((category: any, idx: number) => (
              <Link
                key={category._id || category.id}
                href={`/category/${category.slug}`}
                className="group relative h-[450px] flex flex-col bg-white border border-black/5 rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="h-2/3 overflow-hidden relative">
                   <OptimizedImage 
                     src={resolveImageUrl(category.image)}
                     alt={category.name}
                     fill
                     context="banner"
                     className="object-cover transition-transform duration-1000 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   
                   <div className="absolute top-8 left-8">
                        <span className="flex items-center gap-2 px-5 py-2.5 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#0B1221] shadow-xl">
                           {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                   </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-px bg-blue-600 transition-all duration-700 group-hover:w-12" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                        {category.subcategories?.length || 0} Sub-sections
                      </span>
                    </div>

                    <h3 className="hero-display text-4xl tracking-tighter text-[#0B1221] group-hover:translate-x-2 transition-transform duration-700">
                      {category.name}.
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-black/5">
                    <span className="text-[10px] font-black text-[#0B1221]/30 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">
                      Enter Gallery
                    </span>
                    <ArrowRight
                      size={18}
                      className="text-[#0B1221]/20 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-700"
                    />
                  </div>
                </div>

                {/* Hover Ambient Glow */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </Link>
            ))}
          </div>
        )}

        {/* Dynamic Footer */}
        <div className="mt-40 pt-20 border-t border-black/5 flex flex-col items-center">
          <div className="w-px h-24 bg-gradient-to-b from-blue-600 to-transparent opacity-30 mb-8" />
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#0B1221]/20 text-center px-12 leading-relaxed">
            Curated by Seivibe Creative House. <br /> All collections are strictly verified.
          </p>
        </div>
      </div>
    </div>
  );
}

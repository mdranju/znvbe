"use client";

import { useGetFeaturedProductsQuery } from "@/src/store/api/productApi";
import { BatchProductSlider } from "../common/BatchProductSlider";
import { ProductCardSkeleton } from "../ui/SkeletonComponents";
import { Crown } from "lucide-react";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useGetFeaturedProductsQuery();

  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
          {/* <div className="w-2 h-8 bg-blue-600 rounded-full" /> */}
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-[#0B1221] uppercase tracking-tight flex items-center">
              <Crown className="text-yellow-400 mr-1" size={35} /> Top Featured.
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
              Our most premium pieces, curated for the modern wardrobe.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
        </div>
      ) : (
        <BatchProductSlider products={products} />
      )}
    </section>
  );
}

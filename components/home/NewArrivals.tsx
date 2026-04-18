"use client";

import { useGetNewArrivalsQuery } from "@/src/store/api/productApi";
import { motion } from "motion/react";
import { ProductCard } from "../product/ProductCard";
import { ProductCardSkeleton } from "../ui/SkeletonComponents";
import { AiOutlineThunderbolt } from "react-icons/ai";

export default function NewArrivals() {
  const { data: products, isLoading } = useGetNewArrivalsQuery({ limit: 8 });

  if (!isLoading && (!products || products.length === 0)) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-0 lg:mb-20 mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
          {/* <div className="w-2 h-8 bg-blue-600 rounded-full" /> */}
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-[#0B1221] uppercase tracking-tight flex items-center">
              <AiOutlineThunderbolt size={35} className="text-orange-600" />
              New Arrivals.
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
              The latest additions to our platform, updated daily.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, i) => <ProductCardSkeleton key={i} />)
          : products?.map((product: any, i: number) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
      </div>
    </section>
  );
}

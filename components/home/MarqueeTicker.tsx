"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useGetMarqueesQuery } from "@/src/store/api/marqueeApi";

function MarqueeTicker() {
  const { data: marqueeData, isLoading } = useGetMarqueesQuery();

  if (isLoading) return null;

  const marquees = [...(marqueeData || [])].sort(
    (a: any, b: any) => (a.order || 0) - (b.order || 0),
  );

  // Use static fallback if no marquees in DB yet
  const MARQUEE_ITEMS =
    marquees.length > 0
      ? marquees.map((m: any) => ({
          label: m.text,
          slug: m.link || "new-arrivals",
        }))
      : [
          { label: "New Arrivals", slug: "new-arrivals" },
          { label: "Premium Quality", slug: "premium" },
          { label: "Free Delivery", slug: "free-delivery" },
          { label: "Bangladesh's Finest", slug: "bangladesh" },
        ];

  // Duplicate items for seamless loop to ensure enough overflow for animation
  const displayItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <>
      <div className="hidden lg:block relative py-1 lg:py-2 select-none overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex items-center border-y border-gray-100 bg-[#0B1221] py-4">
          <div className="marquee-track flex whitespace-nowrap">
            {displayItems.map((item, i) => (
              <Link
                href={
                  item.slug.startsWith("/")
                    ? item.slug
                    : `/products?query=${item.slug}`
                }
                key={i}
                className="group flex items-center gap-6 px-10 relative"
              >
                <span className="flex items-center gap-4 text-xs font-black text-white/60 tracking-[0.3em] uppercase transition-all duration-500 group-hover:text-blue-400 group-hover:scale-105">
                  {item.label}
                  <MoveRight
                    size={14}
                    className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-blue-500"
                  />
                </span>
                <span className="text-blue-500/30 font-light text-xl">/</span>
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 blur-xl transition-all duration-500 rounded-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MarqueeTicker;

"use client";

import { useGetBannersQuery } from "@/src/store/api/bannerApi";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BannerSkeleton } from "@/components/ui/SkeletonComponents";

function CTABanner() {
  const { data: banners = [], isLoading } = useGetBannersQuery("cta");
  const cta = banners[0];

  if (isLoading) {
    return (
      <section className="cta-banner-desktop max-w-7xl mx-auto w-full px-4 lg:px-0">
        <BannerSkeleton />
      </section>
    );
  }

  if (!cta && !isLoading) return null;

  return (
    <section className="cta-banner-desktop max-w-7xl mx-auto w-full px-4 lg:px-0 lg:-mt-28 -mt-14">
      <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-[#0B1221] px-6 py-12 md:px-12 md:py-16 lg:px-20 lg:py-20 text-center border border-blue-500/10 shadow-3xl group">
        {/* Ambient glow blobs */}
        <div className="absolute desktop-glow-blob w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-blue-600/10 lg:bg-blue-600/20 -top-20 -left-20 lg:-top-48 lg:-left-48 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute desktop-glow-blob w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-indigo-600/10 lg:bg-indigo-600/20 -bottom-20 -right-20 lg:-bottom-48 lg:-right-48 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-blue-500 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-3 lg:mb-4 animate-pulse">
            {cta.subtitle || "Limited Time Offer"}
          </p>

          <h2 className="hero-display text-white text-3xl md:text-5xl lg:text-7xl mb-4 lg:mb-6 font-black leading-[1.1] max-w-4xl">
            {cta.title}
          </h2>

          <p className="text-white/50 text-sm md:text-base lg:text-lg max-w-2xl mx-auto mb-8 lg:mb-10 font-medium leading-relaxed px-4">
            {cta.description}
          </p>

          <Link
            href={cta.link || "/products"}
            className="btn-glow inline-flex items-center gap-4 bg-white text-[#0B1221] px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black text-[11px] md:text-[13px] transition-all hover:scale-105 shadow-2xl uppercase tracking-[0.2em] group/btn active:scale-95"
          >
            {cta.buttonText || "View Collection"}
            <div className="w-8 h-8 rounded-full bg-[#0B1221] flex items-center justify-center text-white group-hover/btn:translate-x-1 transition-transform">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;

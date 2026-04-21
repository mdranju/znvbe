"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useGetBannersQuery } from "@/src/store/api/bannerApi";
import { SITE_CONFIG } from "@/src/config/site";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { resolveImageUrl } from "@/src/utils/image";
import { BannerSkeleton } from "@/components/ui/SkeletonComponents";
import { Carousel } from "@/components/common/Carousel";

interface HeroBannerProps {
  initialBanners?: any[];
}

export const HeroBanner = ({ initialBanners }: HeroBannerProps) => {
  const { data: banners = initialBanners || [], isLoading } = useGetBannersQuery("hero", {
    skip: !!initialBanners && initialBanners.length > 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const heroSlides = banners
    .filter((b: any) => b.type === "hero" && b.status === "active")
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  return (
    <section className="w-full lg:px-4 px-2">
      <div className="relative w-full aspect-[4/1.69] md:aspect-[21/8.3] overflow-hidden border-b mt-4 border-white/5 group rounded-2xl">
        {isLoading ? (
          <BannerSkeleton />
        ) : (
          <Carousel
            autoplay
            autoplayDelay={5000}
            fade
            showDots
            onSelect={setActiveIndex}
            className="h-full"
            containerClassName="h-full"
            dotColor="bg-white"
          >
            {heroSlides.length > 0 ? (
              heroSlides.map((slide: any, index: number) => (
                <div
                  key={slide._id || index}
                  className="relative w-full h-full flex-[0_0_100%]"
                >
                  <Link href={slide.ctaLink || "/products"}>
                    <div className="relative w-full h-full overflow-hidden group/slide">
                      <OptimizedImage
                        src={resolveImageUrl(slide.image)}
                        alt={slide.title || `Product showcase ${index + 1}`}
                        width={1920}
                        height={900}
                        className="object-cover h-full w-full"
                        priority={index === 0}
                        context="hero"
                        showSkeleton={false}
                      />
                      <div className="absolute inset-0 bg-[#0B1221]/10 opacity-0 group-hover/slide:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10"></div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="relative w-full h-full bg-[#0B1221] flex items-center justify-center">
                <p className="text-white/20 text-sm font-black uppercase tracking-[0.5em]">
                  {SITE_CONFIG.name} Premium
                </p>
              </div>
            )}
          </Carousel>
        )}

        {/* Desktop: Text overlay on hero */}
        {!isLoading && heroSlides.length > 0 && (
          <div className=" hidden lg:flex absolute inset-0 z-20 items-center pointer-events-none">
            <div className="relative px-20 max-w-2xl">
              <p
                key={`badge-${activeIndex}`}
                className="animate-in fade-in slide-in-from-left-8 duration-700 text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 flex items-center gap-4"
              >
                Make Your Mark
              </p>
              <h1
                key={`title-${activeIndex}`}
                className="animate-in fade-in slide-in-from-left-12 duration-1000 delay-100 hero-display text-white text-6xl xl:text-7xl mb-6 leading-[1.1]"
              >
                {heroSlides[activeIndex]?.title || SITE_CONFIG.name}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  {heroSlides[activeIndex]?.subtitle || "Premium Collection"}
                </span>
              </h1>
              <p
                key={`desc-${activeIndex}`}
                className="animate-in fade-in slide-in-from-left-16 duration-1000 delay-200 text-white/70 text-lg mb-12 leading-relaxed max-w-lg font-medium drop-shadow-md"
              >
                {heroSlides[activeIndex]?.description ||
                  "Crafted with precision for the modern lifestyle. Experience unmatched comfort and timeless style."}
              </p>
              <Link
                href={heroSlides[activeIndex]?.ctaLink || "/products"}
                className="pointer-events-auto inline-flex items-center gap-4 bg-white text-[#0B1221] px-10 py-5 rounded-[2rem] font-black text-[11px] transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.2)] uppercase tracking-[0.3em] group/shop animate-in fade-in slide-in-from-left-20 duration-1000 delay-300"
              >
                Shop Now{" "}
                <ArrowRight
                  size={16}
                  className="group-hover/shop:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;

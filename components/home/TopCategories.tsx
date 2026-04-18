"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

import { useGetCategoriesQuery } from "@/src/store/api/categoryApi";
import { useCMS } from "@/src/hooks/useCMS";

function TopCategories() {
  const { getImageUrl } = useCMS();
  const { data: featuredCategories = [], isLoading: isFeaturedLoading } =
    useGetCategoriesQuery({ isFeatured: true, status: "active" });
  const { data: allCategories = [], isLoading: isAllLoading } =
    useGetCategoriesQuery(
      { status: "active" },
      { skip: featuredCategories.length > 0 },
    );

  const allCategoriesList =
    featuredCategories.length > 0 ? featuredCategories : allCategories;
  const categories = allCategoriesList.filter(
    (cat: any) => cat.showInExplore === true,
  );
  const isLoading =
    isFeaturedLoading || (featuredCategories.length === 0 && isAllLoading);

  // Embla setup for mobile marquee
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [AutoScroll({ speed: 1, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  return (
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-0">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-blue-600 text-[10px] lg:text-xs font-black tracking-[0.3em] uppercase mb-1.5 lg:mb-2 text-left">
            Browse
          </p>
          <h2 className="text-xl lg:text-2xl font-black text-[#0B1221] tracking-tight underline decoration-blue-500/20 underline-offset-8 uppercase">
            Categories
          </h2>
        </div>
        <Link
          href="/categories"
          className="group flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
        >
          View All{" "}
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      {/* 1. Desktop Grid Layout (lg+) */}
      <div className="hidden lg:grid grid-cols-9 gap-8">
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center animate-pulse"
                >
                  <div className="w-full aspect-square rounded-[2rem] bg-gray-100 mb-5" />
                  <div className="h-4 w-20 bg-gray-100 rounded" />
                </div>
              ))
          : categories.map((cat) => (
              <CategoryCard key={cat._id} cat={cat} getImageUrl={getImageUrl} />
            ))}
      </div>

      {/* 2. Mobile Horizontal Auto-Scrolling Marquee (lg hidden) */}
      {!isLoading && categories.length > 0 && (
        <div className="lg:hidden -mx-4 relative group/marquee overflow-hidden">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex px-4 gap-3">
              {categories.map((cat) => (
                <div key={cat._id} className="embla__slide flex-[0_0_auto] py-2">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex flex-col items-center gap-2 group active:scale-95 transition-all"
                  >
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm p-0.5 relative">
                      <div className="w-full h-full rounded-xl overflow-hidden relative">
                        <Image
                          width={100}
                          height={100}
                          src={getImageUrl(cat.image) || "/placeholder.jpg"}
                          alt={cat.name || "Category"}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#0B1221] tracking-tight text-center">
                      {cat.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        </div>
      )}

      <style jsx global>{`
        .embla__container {
          backface-visibility: hidden;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}

// Reusable Desktop Card Component
function CategoryCard({
  cat,
  getImageUrl,
}: {
  cat: any;
  getImageUrl: (path: string) => string;
}) {
  return (
    <Link
      href={`/category/${cat.slug}`}
      className="flex flex-col items-center group cursor-pointer"
    >
      <div className="w-full aspect-square rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 relative mb-5 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.2)] group-hover:-translate-y-2">
        <Image
          width={500}
          height={500}
          src={getImageUrl(cat.image) || "/placeholder.jpg"}
          alt={cat.name || "Category"}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500" />
      </div>
      <span className="text-base font-bold text-gray-900 tracking-tight transition-colors group-hover:text-blue-600 text-center -mt-4">
        {cat.name}
      </span>
      <div className="h-px w-0 bg-blue-600 mt-1.5 transition-all duration-500 group-hover:w-8" />
    </Link>
  );
}

export default TopCategories;

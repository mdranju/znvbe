"use client";
import { useGetProductsQuery } from "@/src/store/api/productApi";
import { useGetCategoriesQuery } from "@/src/store/api/categoryApi";
import { useCMS } from "@/src/hooks/useCMS";
import Image from "next/image";
import Link from "next/link";
import { BatchProductSlider } from "../common/BatchProductSlider";
import { ProductCardSkeleton } from "../ui/SkeletonComponents";

function BannerSection({
  img: rawImg,
  title,
  description,
  categorySlug,
  categoryName,
  categoryId,
  subtitle,
}: {
  img: string;
  title: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  categoryId: string;
  subtitle: string;
}) {
  const { getImageUrl } = useCMS();
  const img = getImageUrl(rawImg);
  const { data, isLoading } = useGetProductsQuery({
    category: categoryId,
    limit: 24, // Increased limit for slider
  });
  const products = data?.result || data;
  return (
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-0">
      <div className="relative w-full aspect-[21/9] md:aspect-[21/6] bg-[#0B1221] lg:rounded-[2.5rem] rounded-[1.5rem] overflow-hidden group shadow-2xl mb-4 border border-white/5">
        <Image
          src={img}
          alt={`Promotional banner for ${title}`}
          fill
          sizes="(max-width: 1024px) 100vw, 1280px"
          className="object-cover opacity-60 transition-transform duration-[2s] ease-out group-hover:scale-110"
        />

        {/* Advanced Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-[#0B1221]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221]/80 via-transparent to-transparent z-10" />

        <div className="absolute inset-0 z-20 flex flex-col md:flex-row items-center justify-between px-8 md:px-20 lg:px-24 py-10 md:py-0 pointer-events-none">
          {/* Left Side: Content */}
          <div className="max-w-xl text-center md:text-left">
            <p className="text-blue-400 text-[10px] md:text-xs font-black tracking-[0.5em] uppercase mb-4 flex items-center justify-center md:justify-start gap-4">
              <span className="w-8 h-px bg-blue-500 hidden md:block" />
              {categoryName}
            </p>
            <h2 className="hero-display text-white text-3xl md:text-5xl lg:text-6xl mb-6 font-black leading-tight">
              {title}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6 text-white/50 text-xs md:text-sm font-medium">
              <span>{description}</span>
              <span className="w-1 h-1 bg-blue-500 rounded-full" />
              <span>{subtitle}</span>
            </div>
          </div>

          {/* Right Side: CTA Button */}
          <div className="mt-8 md:mt-0 pointer-events-auto">
            <Link
              href={`/category/${categorySlug}`}
              className="btn-glow inline-flex items-center gap-4 bg-white text-[#0B1221] px-10 md:px-14 py-4 md:py-6 rounded-full font-black text-[10px] md:text-[12px] transition-all hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.2)] uppercase tracking-[0.2em] group/btn active:scale-[0.98]"
              aria-label={`Explore more from ${title}`}
            >
              Explore More
              <div
                className="w-8 h-8 rounded-full bg-[#0B1221] flex items-center justify-center text-white group-hover/btn:translate-x-1 transition-transform"
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Product Grid / Slider */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 lg:mb-24">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
        </div>
      ) : (
        <div className="mb-8 lg:mb-12">
          <BatchProductSlider products={products} />
        </div>
      )}
    </section>
  );
}

function MinimalCategorySection({
  categoryId,
  categoryName,
  categorySlug,
}: {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
}) {
  const { data, isLoading } = useGetProductsQuery({
    category: categoryId,
    limit: 24, // Increased limit for slider
  });
  const products = data?.result || data;

  if (!isLoading && (!products || products.length === 0)) return null;

  return (
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-0 lg:-mt-20 -mt-10">
      <div className="flex items-center justify-between mb-4 border-b border-black/[0.03] pb-4">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-blue-600 rounded-full" />
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-[#0B1221] uppercase tracking-tight">
              {categoryName}
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
              {categoryName} - New Collection
            </p>
          </div>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-[#0B1221] transition-colors flex items-center gap-2 group"
        >
          Explore All
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="M5 12h14m-7-7 7 7-7 7" />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 lg:mb-16">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
        </div>
      ) : (
        <div className="mb-8 lg:mb-12">
          <BatchProductSlider products={products} />
        </div>
      )}
    </section>
  );
}

function ProductItemsSection() {
  const { data: allCategories = [], isLoading: isCatLoading } =
    useGetCategoriesQuery({ status: "active" });

  if (isCatLoading) {
    return (
      <div className="space-y-16 animate-pulse">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="max-w-7xl mx-auto w-full space-y-8 px-4 lg:px-0"
          >
            <div className="h-40 md:h-64 bg-gray-100 rounded-[2.5rem] w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Array(4)
                .fill(0)
                .map((_, j) => (
                  <ProductCardSkeleton key={j} />
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {allCategories.map((cat: any) =>
        cat.showBanner ? (
          <BannerSection
            key={cat.slug}
            img={
              cat.bannerImage ||
              cat.image ||
              `https://picsum.photos/seed/${cat.slug}/1200/400`
            }
            title={cat.bannerTitle || cat.name}
            description={
              cat.bannerSubtitle ||
              cat.description ||
              "Premium Quality Collection"
            }
            categoryId={cat._id || cat.id}
            categorySlug={cat.slug}
            categoryName={cat.name}
            subtitle={cat.bannerDescription || "Exclusively Crafted"}
          />
        ) : (
          <MinimalCategorySection
            key={cat.slug}
            categoryId={cat._id || cat.id}
            categoryName={cat.name}
            categorySlug={cat.slug}
          />
        ),
      )}
    </div>
  );
}

export default ProductItemsSection;

import { products } from "@/lib/data";
import Image from "next/image";
import { ProductCard } from "../product/ProductCard";
import Link from "next/link";

const panjabiProducts = products.filter((p) => p.category === "panjabi");
const tshirtProducts = products.filter((p) => p.category === "t-shirt");
const luxuryPanjabiProducts = products
  .filter((p) => p.category === "luxury-panjabi")
  .slice(0, 4);

function BannerSection({
  img,
  title,
  description,
  category,
  products,
  subtitle,
}: {
  img: string;
  title: string;
  description: string;
  category: string;
  products?: any[];
  subtitle: string;
}) {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 lg:px-0">
      <div className="relative w-full aspect-[21/9] md:aspect-[21/6] bg-[#0B1221] lg:rounded-[2.5rem] rounded-[1.5rem] overflow-hidden group shadow-2xl mb-12 border border-white/5">
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
              {category}
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
              href={`/products?category=${category.toLowerCase()?.replace(" ", "-")}`}
              className="btn-glow inline-flex items-center gap-4 bg-white text-[#0B1221] px-10 md:px-14 py-4 md:py-6 rounded-full font-black text-[10px] md:text-[12px] transition-all hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.2)] uppercase tracking-[0.2em] group/btn active:scale-95"
              aria-label={`Explore more from ${title}`}
            >
              Explore More
              <div className="w-8 h-8 rounded-full bg-[#0B1221] flex items-center justify-center text-white group-hover/btn:translate-x-1 transition-transform" aria-hidden="true">
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

      {/* Product Grid */}
      <div className="product-grid-desktop grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 lg:mb-24">
        {products?.map((product) => (
          <div key={product.id} className="product-card-desktop">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductItemsSection() {
  return (
    <div className="space-y-16 lg:space-y-20">
      {/* ── Panjabi Section ─────────────────────────────────── */}
      <BannerSection
        img="https://picsum.photos/seed/panjabibanner/1200/400"
        title="Classic Panjabi"
        description="Premium Fabric"
        category="Best Sellers"
        products={panjabiProducts}
        subtitle="Quality Design"
      />

      {/* ── T-Shirt Section ─────────────────────────────────── */}
      <BannerSection
        img="https://picsum.photos/seed/tshirtbanner/1200/400"
        title="Essential T-Shirts"
        description="Comfortable Fit"
        category="Casual Style"
        products={tshirtProducts}
        subtitle="100% Cotton"
      />

      {/* ── Polo Banner Section ─────────────────────────────── */}
      <BannerSection
        img="https://picsum.photos/seed/polobanner/1200/400"
        title="Classic Polo"
        description="Premium Fabric"
        category="Best Sellers"
        subtitle="Quality Design"
        products={luxuryPanjabiProducts}
      />
    </div>
  );
}

export default ProductItemsSection;

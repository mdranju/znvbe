import { products } from "@/lib/data";
import Image from "next/image";
import { ProductCard } from "../product/ProductCard";

const panjabiProducts = products.filter((p) => p.category === "panjabi");
const tshirtProducts = products.filter((p) => p.category === "t-shirt");
const luxuryPanjabiProducts = products.filter((p) => p.category === "luxury-panjabi").slice(0, 4);

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
      <div className="relative w-full aspect-[21/7] md:aspect-[21/6] bg-[#0B1221] lg:rounded-[2rem] rounded-[1rem] overflow-hidden group shadow-2xl mb-8 lg:mb-12">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center px-12 md:px-20 pointer-events-none">
          <div className="max-w-md">
            <p className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase mb-4">
              {category}
            </p>
            <h2 className="hero-display text-white text-3xl md:text-5xl lg:mb-6 mb-4">
              {title}
            </h2>
            <div className="flex items-center gap-4 text-white/60 text-sm font-medium">
              <span>{description}</span>
              <span className="w-1 h-1 bg-blue-500 rounded-full" />
              <span>{subtitle}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="product-grid-desktop grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {products?.map((product) => (
          <div key={product.id} className="product-card-desktop mb-4 md:mb-10">
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

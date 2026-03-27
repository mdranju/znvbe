import { products } from "@/lib/data";
import Image from "next/image";
import { ProductCard } from "../product/ProductCard";

const panjabiProducts = products.filter((p) => p.category === "panjabi");
const tshirtProducts = products.filter((p) => p.category === "t-shirt");

function ProductItemsSection() {
  return (
    <>
      {/* ── Panjabi Section ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-6">
        <div className="relative w-full aspect-[21/7] md:aspect-[21/6] bg-[#0B1221] mb-12 rounded-[2rem] overflow-hidden group shadow-2xl">
          <Image
            src="https://picsum.photos/seed/panjabibanner/1200/400"
            alt="Panjabi Collection"
            fill
            className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center px-12 md:px-20 pointer-events-none">
            <div className="max-w-md">
              <p className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase mb-4">
                Best Sellers
              </p>
              <h2 className="hero-display text-white text-4xl md:text-5xl mb-6">
                Classic Panjabi
              </h2>
              <div className="flex items-center gap-4 text-white/60 text-sm font-medium">
                <span>Premium Fabric</span>
                <span className="w-1 h-1 bg-blue-500 rounded-full" />
                <span>Quality Design</span>
              </div>
            </div>
          </div>
        </div>
        <div className="product-grid-desktop grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {panjabiProducts.map((product) => (
            <div key={product.id} className="product-card-desktop">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ── T-Shirt Section ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-6">
        <div className="relative w-full aspect-[21/7] md:aspect-[21/6] bg-[#0B1221] mb-12 rounded-[2rem] overflow-hidden group shadow-2xl">
          <Image
            src="https://picsum.photos/seed/tshirtbanner/1200/400"
            alt="T-Shirt Collection"
            fill
            className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center px-12 md:px-20 pointer-events-none">
            <div className="max-w-md">
              <p className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase mb-4">
                Casual Style
              </p>
              <h2 className="hero-display text-white text-4xl md:text-5xl mb-6">
                Essential T-Shirts
              </h2>
              <div className="flex items-center gap-4 text-white/60 text-sm font-medium">
                <span>Comfortable Fit</span>
                <span className="w-1 h-1 bg-blue-500 rounded-full" />
                <span>100% Cotton</span>
              </div>
            </div>
          </div>
        </div>
        <div className="product-grid-desktop grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {tshirtProducts.map((product) => (
            <div key={product.id} className="product-card-desktop">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Polo Banner Section ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-6">
        <div className="relative w-full aspect-[21/7] md:aspect-[21/6] bg-[#0B1221] rounded-[2rem] overflow-hidden group shadow-2xl">
          <Image
            src="https://picsum.photos/seed/polobanner/1200/400"
            alt="Polo Collection"
            fill
            className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1221] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center px-12 md:px-20 pointer-events-none">
            <div className="max-w-md">
              <p className="text-blue-400 text-xs font-black tracking-[0.4em] uppercase mb-4">
                Modern Selection
              </p>
              <h2 className="hero-display text-white text-4xl md:text-5xl mb-6">
                Modern Polo Shirts
              </h2>
              <div className="flex items-center gap-4 text-white/60 text-sm font-medium">
                <span>Athletic Fit</span>
                <span className="w-1 h-1 bg-blue-500 rounded-full" />
                <span>Breathable Material</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductItemsSection;

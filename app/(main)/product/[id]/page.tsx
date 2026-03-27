"use client";

import { products } from "@/lib/data";
import { addToCart } from "@/src/store/slices/cartSlice";
import { ImageLightbox } from "@/components/product/ImageLightbox";
import { ProductCard } from "@/components/product/ProductCard";
import { BackButton } from "@/components/common/BackButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { ShieldCheck, Truck, ArrowLeftRight, Clock } from "lucide-react";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const product =
    products.find((p) => p.slug === resolvedParams.id) || products[0];
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please Select a Size", {
        description:
          "You must select a size before adding this item to your cart.",
      });
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: selectedImage,
        size: selectedSize,
        quantity,
      }),
    );

    toast.success("Added to Cart! 🛒", {
      description: "Your item has been successfully added to your cart.",
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please Select a Size", {
        description:
          "You must select a size before adding this item to your cart.",
      });
      return;
    }
    handleAddToCart();
    router.push("/checkout"); // Will create this later
  };

  const sizes = ["M", "L", "XL", "XXL"];
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-20 bg-white/50 backdrop-blur-3xl min-h-screen">
      <div className="mb-8">
        <BackButton className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-[0.4em]" />
      </div>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start mb-24">
        {/* Product Images */}
        <div className="w-full lg:w-[55%] flex flex-col gap-6 lg:sticky lg:top-32">
          <div
            className="relative w-full aspect-square bg-[#F8FAFC] rounded-[2rem] lg:rounded-[3rem] overflow-hidden cursor-zoom-in border border-black/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] group"
            onMouseEnter={() => isDesktop && setIsZooming(true)}
            onMouseLeave={() => isDesktop && setIsZooming(false)}
            onMouseMove={handleMouseMove}
            onClick={() => {
              const idx = images.indexOf(selectedImage);
              setLightboxIndex(idx >= 0 ? idx : 0);
              setIsLightboxOpen(true);
            }}
          >
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              priority
              className="object-contain lg:object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

            {/* Desktop Zoom Popup Overlay */}
            {isZooming && isDesktop && (
              <div
                className="absolute inset-0 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#F8FAFC]"
                style={{
                  backgroundImage: `url(${selectedImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "250%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </div>

          <div className="flex flex-row gap-4 w-full overflow-x-auto hide-scrollbar px-2 py-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-24 aspect-square shrink-0 rounded-2xl lg:rounded-3xl overflow-hidden border-2 transition-all duration-500 ${selectedImage === img ? "border-blue-600 scale-105 shadow-xl shadow-blue-500/10" : "border-black/5 opacity-50 hover:opacity-100 hover:border-black/10"}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-[50%] flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <p className="text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase">
              Product Details
            </p>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <h1 className="text-2xl lg:text-4xl font-black text-[#0B1221] leading-[1.1] mb-6 tracking-tighter">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                In Stock
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-[0.2em]">
              REF: {product.id}
            </span>
          </div>

          <div className="flex items-baseline gap-5 mb-12">
            <span className="text-3xl font-black text-[#0B1221] tracking-tighter">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-2xl text-[#0B1221]/20 line-through font-bold">
                ৳{product.originalPrice}
              </span>
            )}
          </div>

          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <label className="text-[10px] font-black text-[#0B1221]/30 uppercase tracking-[0.3em]">
                Select Size
              </label>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[4.5rem] h-14 flex items-center justify-center text-sm font-black transition-all duration-500 rounded-2xl border-2 ${
                    selectedSize === size
                      ? "border-[#0B1221] bg-[#0B1221] text-white shadow-2xl shadow-black/20 scale-105"
                      : "border-black/5 bg-gray-50/50 text-[#0B1221]/60 hover:border-black/10 hover:bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 mb-16">
            <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-3xl border border-black/5 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-lg font-black bg-white rounded-2xl hover:bg-[#0B1221] hover:text-white transition-all text-[#0B1221] shadow-sm active:scale-95"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                readOnly
                className="w-14 text-center bg-transparent focus:outline-none font-black text-[#0B1221] text-lg"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center text-lg font-black bg-white rounded-2xl hover:bg-[#0B1221] hover:text-white transition-all text-[#0B1221] shadow-sm active:scale-95"
              >
                +
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full md:flex-1 bg-white text-[#0B1221] border-2 border-[#0B1221]/5 h-16 lg:h-20 font-black text-[11px] uppercase tracking-[0.2em] rounded-[1.5rem] lg:rounded-[2rem] hover:bg-gray-50 hover:border-[#0B1221]/10 transition-all shadow-xl shadow-black/5 active:scale-[0.98] shrink-0"
              >
                Add To Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full md:flex-[1.5] bg-[#0B1221] text-white h-16 lg:h-20 font-black text-[11px] uppercase tracking-[0.2em] rounded-[1.5rem] lg:rounded-[2rem] hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] shrink-0"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* ── Product Highlights ── */}
          <div className="hidden lg:grid grid-cols-2 gap-4 mt-8 w-full">
            {[
              {
                icon: ShieldCheck,
                title: "High Quality",
                desc: "Checked for quality",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "Nationwide tracking",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="glass-card p-5 rounded-3xl flex items-center gap-4 group"
                >
                  <div className="p-3 bg-blue-100/50 text-blue-600 rounded-2xl shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-black text-gray-900 leading-none mb-1 uppercase tracking-tight">
                      {feature.title}
                    </h4>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-100 py-24">
        <div className="flex justify-center gap-12 mb-16 relative">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "description" ? "text-blue-600 scale-105" : "text-gray-400 hover:text-gray-900"}`}
          >
            Description
            {activeTab === "description" && (
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("additional")}
            className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "additional" ? "text-blue-600 scale-105" : "text-gray-400 hover:text-gray-900"}`}
          >
            Information
            {activeTab === "additional" && (
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
            )}
          </button>
        </div>

        {activeTab === "description" && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
                    Our Collection
                  </p>
                  <h2 className="text-3xl font-black text-gray-900 leading-none mb-6">
                    Premium <br /> {product.name}
                  </h2>
                  <p className="text-gray-500 font-medium leading-loose text-base">
                    ✨ This piece blends classic tradition with a modern,
                    refined finish, making it perfect for both festive and
                    formal occasions. Crafted with the modern believer in mind.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1221] mb-2">
                      Authentic
                    </h4>
                    <p className="text-sm font-bold text-gray-400">
                      Original product
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1221] mb-2">
                      Material
                    </h4>
                    <p className="text-sm font-bold text-gray-400">
                      High quality fabric
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/5 group">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221]/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="px-6 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em]">
                    Comfortable Fit
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox — swipe, pinch-to-zoom, pan */}
      <ImageLightbox
        key={lightboxIndex}
        images={images}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* ── Desktop-only Related Products ── */}
      <div className="hidden lg:block border-t border-gray-100 py-24 section-reveal">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 text-xs font-black tracking-[0.4em] uppercase mb-4">
              Similar Style
            </p>
            <h2 className="premium-section-title">You May Also Like</h2>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 product-grid-desktop">
          {products
            .filter(
              (p) => p.category === product.category && p.id !== product.id,
            )
            .slice(0, 4)
            .map((p) => (
              <div key={p.id} className="product-card-desktop">
                <ProductCard product={p} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

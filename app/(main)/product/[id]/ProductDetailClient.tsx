"use client";

import dynamic from "next/dynamic";
import { BackButton } from "@/components/common/BackButton";
import DescriptionTabs from "@/components/product/DescriptionTabs";
import { ProductCard } from "@/components/product/ProductCard";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { addToCart } from "@/src/store/slices/cartSlice";
import { ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { sortSizes } from "@/src/utils/size";
import { SITE_CONFIG } from "@/src/config/site";
import { useDispatch } from "react-redux";
import { WhatsAppOrderButton } from "@/components/product/WhatsAppOrderButton";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
  getProductImage,
  getProductImages,
} from "@/src/utils/image";
import { Carousel } from "@/components/common/Carousel";

const ImageLightbox = dynamic(
  () =>
    import("@/components/product/ImageLightbox").then(
      (mod) => mod.ImageLightbox,
    ),
  { ssr: false },
);

interface ProductDetailClientProps {
  product: any;
  products: any[];
}

export default function ProductDetailClient({
  product: rawProduct,
  products: rawRelatedProducts,
}: ProductDetailClientProps) {
  // Normalize product data
  const product = {
    ...rawProduct,
    id: rawProduct._id || rawProduct.id,
    image: getProductImage(rawProduct),
    images: getProductImages(rawProduct),
    category:
      typeof rawProduct.category === "object"
        ? rawProduct.category.name
        : rawProduct.category,
    categoryId:
      typeof rawProduct.category === "object"
        ? rawProduct.category._id
        : rawProduct.category,
  };

  const relatedProducts = rawRelatedProducts.map((p) => ({
    ...p,
    id: p._id || p.id,
    image: getProductImage(p),
  }));

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0
      ? typeof product.colors[0] === "string"
        ? product.colors[0]
        : product.colors[0].name
      : "Original",
  );
  const [activeTab, setActiveTab] = useState("description");
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [currentPageUrl, setCurrentPageUrl] = useState("");

  const displaySizes = useMemo(() => {
    const rawSizes =
      product.sizes && product.sizes.length > 0
        ? product.sizes.map((s: any) =>
            typeof s === "string"
              ? {
                  name: s,
                  stock: product.stock || 10,
                  inStock: (product.stock || 10) > 0,
                }
              : s,
          )
        : [
            { name: "S", stock: 10, inStock: true },
            { name: "M", stock: 10, inStock: true },
            { name: "L", stock: 10, inStock: true },
            { name: "XL", stock: 10, inStock: true },
            { name: "XXL", stock: 10, inStock: true },
          ];
    return sortSizes(rawSizes);
  }, [product.sizes, product.stock]);

  // Colors mapping
  const displayColors =
    product.colors && product.colors.length > 0
      ? product.colors.map((c: any) =>
          typeof c === "string" ? { name: c, value: c.toLowerCase() } : c,
        )
      : [];

  const currentSizeData = product.sizes?.find(
    (s: any) => s.name === selectedSize,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPageUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    setSelectedImage(product.image);
    if (displaySizes && displaySizes.length > 0) {
      const firstAvailable = displaySizes.find((s: any) => s.stock > 0);
      if (firstAvailable) {
        setSelectedSize(firstAvailable.name);
      } else {
        setSelectedSize(displaySizes[0].name);
      }
    } else {
      setSelectedSize("");
    }
    setQuantity(1);
  }, [product.id, product.image, displaySizes]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
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
        description: "You must select a size before adding this item to cart.",
      });
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        sku: currentSizeData?.sku || product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: selectedImage,
        size: selectedSize,
        color: selectedColor,
        quantity,
      }),
    );

    toast.success("Added to Cart! 🛒", {
      description: `${product.name} (${selectedSize}) is now in your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please Select a Size", {
        description: "Select a size to proceed with Buy Now.",
      });
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  const images = product.images;

  // Filter and sort related products
  const filteredRelatedProducts = useMemo(() => {
    return relatedProducts
      .filter((p) => p.id !== product.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [relatedProducts, product.id]);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: SITE_CONFIG.name,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_CONFIG.baseUrl}/product/${product.slug}`,
      priceCurrency: "BDT",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12 lg:py-0 bg-white/50 backdrop-blur-3xl min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mb-8">
        <BackButton className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-[0.4em]" />
      </div>
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start mb-16">
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
            <OptimizedImage
              src={selectedImage}
              alt={product.name}
              fill
              priority
              context="detail"
              showSkeleton={false}
              className="object-contain lg:object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

            {/* Desktop Zoom Overlay */}
            {isZooming && isDesktop && selectedImage && (
              <div
                className="absolute inset-0 z-50 pointer-events-none transition-opacity duration-300 bg-[#F8FAFC]/50"
                style={{
                  backgroundImage: `url("${selectedImage}")`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "250%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </div>

          <div className="flex flex-row gap-4 w-full overflow-x-auto hide-scrollbar px-2 py-4">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                aria-label={`View product image ${idx + 1}`}
                className={`relative w-24 aspect-square shrink-0 rounded-2xl lg:rounded-3xl overflow-hidden border-2 transition-all duration-500 ${selectedImage === img ? "border-blue-600 scale-105 shadow-xl shadow-blue-500/10" : "border-black/5 opacity-50 hover:opacity-100 hover:border-black/10"}`}
              >
                <OptimizedImage
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  fill
                  context="thumbnail"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-[45%] flex flex-col">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-blue-600/10 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-600/20">
              {product.category}
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="text-[10px] font-black text-white px-2 py-1 bg-[#0B1221] rounded-md uppercase tracking-widest">
              SKU: {currentSizeData?.sku || product.id}
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            {currentSizeData?.stock > 0 ? (
              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">
                {currentSizeData.stock} in stock
              </span>
            ) : (
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest px-2 py-0.5 bg-orange-50 rounded-md border border-orange-100">
                {selectedSize ? "Out of Stock" : product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            )}
          </div>

          <h1 className="text-xl lg:text-2xl font-black text-[#0B1221] leading-[1.1] mb-8 tracking-tighter uppercase">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-4 mb-10">
            <span className="lg:text-3xl text-2xl font-black text-[#0B1221] tracking-wide">
              ৳{product.price}
            </span>
            {product.originalPrice && (
              <span className="lg:text-2xl text-xl text-[#0B1221]/20 line-through font-bold tracking-tighter">
                ৳{product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <span className="ml-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
                Save ৳{product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Color Selection */}
          {displayColors.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Color: <span className="text-[#0B1221]">{selectedColor}</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-4">
                {displayColors.map((color: any) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`group relative w-10 h-10 rounded-full border-2 transition-all p-1 ${
                      selectedColor === color.name
                        ? "border-[#0B1221] scale-110 shadow-lg shadow-black/10"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <div
                      className="w-full h-full rounded-full border border-black/5"
                      style={{ backgroundColor: color.value || color.name }}
                    />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase text-[#0B1221] opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-xl px-2 py-1 rounded-md border border-gray-100 z-10 pointer-events-none">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Size Selection
              </label>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                View Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {displaySizes.map((size: any) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  disabled={size.stock === 0}
                  className={`min-w-[4rem] h-14 flex flex-col items-center justify-center transition-all duration-300 rounded-2xl border-2 ${
                    size.stock === 0
                      ? "opacity-40 grayscale cursor-not-allowed border-dashed border-gray-200 bg-gray-50"
                      : selectedSize === size.name
                        ? "border-[#0B1221] bg-[#0B1221] text-white shadow-xl shadow-black/20 translate-y-[-2px]"
                        : "border-black/5 bg-gray-50/50 text-[#0B1221]/60 hover:border-black/20 hover:bg-white"
                  }`}
                >
                  <span className="text-sm font-black">{size.name}</span>
                  {size.stock > 0 && size.stock < 10 && (
                    <span
                      className={`text-[8px] font-black uppercase mt-1 ${selectedSize === size.name ? "text-white/70" : "text-orange-500"}`}
                    >
                      {size.stock} Left
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col gap-5 mb-12">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-black/5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-lg font-black bg-white rounded-xl hover:bg-gray-200 text-[#0B1221] shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  readOnly
                  className="w-12 text-center bg-transparent focus:outline-none font-black text-[#0B1221]"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-lg font-black bg-white rounded-xl hover:bg-gray-200 text-[#0B1221] shadow-sm transition-all active:scale-95"
                >
                  +
                </button>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Quantity
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full md:flex-1 bg-white text-[#0B1221] border-2 border-[#0B1221] h-14 md:h-16 lg:h-20 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl lg:rounded-3xl hover:bg-[#0B1221] hover:text-white transition-all shadow-xl shadow-black/5 active:scale-[0.98] flex items-center justify-center shrink-0"
                >
                  Add To Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full md:flex-[1.5] bg-[#0B1221] text-white h-14 md:h-16 lg:h-20 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl lg:rounded-3xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center shrink-0"
                >
                  Buy Now
                </button>
              </div>
              <WhatsAppOrderButton
                product={product}
                size={selectedSize}
                color={selectedColor}
                quantity={quantity}
                url={currentPageUrl}
              />
            </div>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-8 rounded-3xl border border-gray-100 bg-gray-50/30">
            {product.details?.slice(0, 6).map((detail: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  {detail.name}
                </span>
                <span className="text-[11px] font-bold text-[#0B1221] uppercase">
                  {detail.value}
                </span>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="flex items-center gap-8 mt-10 px-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <ShieldCheck size={20} />
              </div>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">
                Authentic Product
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                <Truck size={20} />
              </div>
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">
                Fast Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <DescriptionTabs
        product={product}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Lightbox */}
      <ImageLightbox
        key={lightboxIndex}
        images={images}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Related Products */}
      <div className="border-t border-gray-100 py-16 section-reveal">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
          <div>
            <p className="text-blue-600 text-xs font-black tracking-[0.4em] uppercase mb-3">
              Similar Style
            </p>
            <h2 className="premium-section-title">You May Also Like</h2>
          </div>
        </div>

        <Carousel
          autoplay
          autoplayDelay={4000}
          showDots
          className="w-full"
          containerClassName="w-full"
          dotColor="bg-[#0B1221]"
          options={{ 
            loop: filteredRelatedProducts.length > 4, 
            align: "start",
            slidesToScroll: 1,
            breakpoints: {
              "(min-width: 640px)": { slidesToScroll: 1 },
              "(min-width: 768px)": { slidesToScroll: 1 },
              "(min-width: 1024px)": { slidesToScroll: 1 }
            }
          } as any}
        >
          {filteredRelatedProducts.map((p: any) => (
            <div key={p.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-3">
              <div className="product-card-container h-full">
                <ProductCard product={p} />
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

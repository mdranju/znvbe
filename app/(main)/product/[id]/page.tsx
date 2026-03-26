"use client";

import { products } from "@/lib/data";
import { addToCart } from "@/src/store/slices/cartSlice";
import { ImageLightbox } from "@/components/product/ImageLightbox";
import { BackButton } from "@/components/common/BackButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

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
  const images = product.images || [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton className="mb-4" />
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12">
        {/* Product Images */}
        <div className="w-full md:w-1/2 flex flex-col gap-4 relative z-10">
          <div
            className={`relative w-full aspect-[4/4] md:aspect-[3/3] bg-gray-100 overflow-hidden cursor-zoom-in`}
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
              width={1000}
              height={1000}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>

          {/* Desktop Zoom Popup */}
          {isZooming && isDesktop && (
            <div
              className="absolute top-0 -right-6 translate-x-full w-[100%] md:w-[110%] aspect-[4/4] md:aspect-[3/3] bg-white z-[60] border border-gray-200 shadow-2xl pointer-events-none rounded-lg"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "250%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}

          <div className="flex flex-row gap-2 w-full overflow-x-auto hide-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 aspect-square sm:aspect-[3/3] shrink-0 border-2 overflow-hidden rounded-lg ${selectedImage === img ? "border-[#0A1128]" : "border-transparent hover:border-gray-300"}`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  fill
                  className="object-cover "
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col items-start md:items-start text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="w-full flex justify-center md:justify-start mb-4">
            <div className="text-sm text-blue-500 bg-blue-50 px-3 py-1 mr-auto md:mx-0">
              In Stock
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 w-full justify-start">
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through font-medium">
                {product.originalPrice}
              </span>
            )}
            <span className="text-2xl font-bold text-gray-900">
              ৳{product.price}
            </span>
          </div>

          <div className="mb-6 w-full text-left">
            <div className="text-sm text-gray-800 mb-2">Select Size:</div>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-10 flex items-center justify-center border text-sm font-medium transition-colors  ${
                    selectedSize === size
                      ? "border-black bg-black text-white rounded"
                      : "border-gray-200 text-gray-700 hover:border-black rounded"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full mb-8">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center w-32 shrink-0 bg-gray-50 rounded-xl border border-gray-200 ">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-100 transition-colors "
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  readOnly
                  className="flex-1 w-full h-12 text-center bg-transparent focus:outline-none font-medium"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center text-xl text-gray-600 hover:bg-gray-100 transition-colors "
                >
                  +
                </button>
              </div>
              <div className="flex-1 flex gap-3 w-full">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#0A1128] text-white h-12 font-medium hover:bg-black transition-colors cursor-pointer rounded-xl relative overflow-hidden"
                >
                  Add To Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#0A1128] text-white h-12 font-medium hover:bg-black transition-colors rounded-xl cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex justify-center gap-8 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "description" ? "text-black" : "text-gray-500 hover:text-gray-800"}`}
          >
            Description
            {activeTab === "description" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("additional")}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "additional" ? "text-black" : "text-gray-500 hover:text-gray-800"}`}
          >
            Additional information
            {activeTab === "additional" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>
            )}
          </button>
        </div>

        {activeTab === "description" && (
          <div className="max-w-3xl mx-auto prose prose-sm">
            <p className="text-gray-600 mb-4">Panjabi</p>
            <h2 className="text-2xl font-bold mb-6">{product.name}</h2>

            <div className="mb-8 relative w-full max-w-md aspect-[4/3]">
              <Image
                src="https://picsum.photos/seed/sizechart/600/400"
                alt="Size Chart"
                fill
                className="object-contain"
              />
            </div>

            <p className="mb-6">
              ✨ This Panjabi blends classic tradition with a modern, refined
              finish, making it perfect for both festive and formal occasions.
            </p>

            <h3 className="font-bold text-lg mb-3">
              📌 Key features & Specifications
            </h3>
            <ul className="list-none space-y-2 mb-6 pl-0">
              <li>
                <strong>Fabric:</strong> Jacquard Print
              </li>
              <li>
                <strong>Pattern:</strong> All-over subtle textured design
              </li>
              <li>
                <strong>Collar Type:</strong> Mandarin Collar
              </li>
              <li>
                <strong>Closure:</strong> Premium Snap Button
              </li>
              <li>
                <strong>Fit type:</strong> Regular fit
              </li>
              <li>
                <strong>Sleeve Type:</strong> Full sleeves featuring contrast
                piping detail
              </li>
            </ul>

            <h3 className="font-bold text-lg mb-3">
              ⭐ Why You&apos;ll Love It
            </h3>
            <ul className="list-none space-y-2 mb-6 pl-0">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span> Unique & Modern
                Designs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span> Elegant color that
                complements all skin tones
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span> Breathable fabric
                ensures all-day comfort in warm climates
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span> Versatile styling
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span> Best finishing
                quality with proper QC
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✅</span> Customer-friendly
                return policy
              </li>
            </ul>

            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-100">
              ⚠️ <strong>Color/Image Disclaimer:</strong> Actual product color
              and design may vary slightly from images due lighting conditions
              and different screen settings.
            </p>
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
    </div>
  );
}

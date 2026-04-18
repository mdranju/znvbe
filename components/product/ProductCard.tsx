"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/src/store/api/wishlistApi";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { getProductImage, resolveImageUrl } from "@/src/utils/image";

export function ProductCard({ product: rawProduct }: { product: any }) {
  const { data: wishlistItems = [] } = useGetWishlistQuery(undefined, {
    skip: !useSelector((state: RootState) => state.auth.isAuthenticated),
  });
  const [add] = useAddToWishlistMutation();
  const [remove] = useRemoveFromWishlistMutation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const product = {
    ...rawProduct,
    id: rawProduct._id || rawProduct.id,
    image: getProductImage(rawProduct),
    secondaryImage:
      rawProduct.images && rawProduct.images.length > 1
        ? resolveImageUrl(rawProduct.images[1])
        : null,
  };

  const isInWishlist = wishlistItems.some(
    (item: any) => (item.product?._id || item.product) === product.id,
  );

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.warning("Login Required", {
        description: "Please login to add items to your wishlist.",
      });
      return;
    }

    try {
      if (isInWishlist) {
        await remove(product.id).unwrap();
        toast.info("Removed from Wishlist", {
          description: `${product.name} has been removed.`,
        });
      } else {
        await add(product.id).unwrap();
        toast.success("Added to Wishlist", {
          description: `${product.name} is now in your favorites.`,
        });
      }
    } catch (error: any) {
      toast.error("Error", {
        description:
          error?.data?.message || error || "Failed to update wishlist.",
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] border border-gray-100 hover:border-blue-100/50 relative">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[1/1] block overflow-hidden bg-[#F8FAFC]"
      >
        {product.badge && (
          <div className="absolute top-3 left-3 z-30 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-xl backdrop-blur-md transition-all duration-500 ${
            isInWishlist
              ? "bg-red-500 text-white shadow-xl shadow-red-500/20 scale-110"
              : "bg-white/80 text-[#0B1221]/20 hover:text-red-500 hover:bg-white"
          }`}
        >
          <Heart
            size={18}
            fill={isInWishlist ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </button>

        {/* Primary Image */}
        <div
          className={`absolute inset-0 z-10 transition-all duration-700 ease-in-out ${product.secondaryImage ? "group-hover:opacity-0 group-hover:scale-110" : "group-hover:scale-110"}`}
        >
          <OptimizedImage
            src={product.image}
            alt={product.name}
            fill
            context="card"
            className="object-cover"
          />
        </div>

        {/* Secondary Image (Hover) */}
        {product.secondaryImage && (
          <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out scale-105 group-hover:scale-100">
            <OptimizedImage
              src={product.secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              context="card"
              className="object-cover"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
      </Link>

      <div className="p-4 flex flex-col flex-grow bg-white">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm text-center font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug uppercase tracking-tight"
          aria-label={`View details for ${product.name}`}
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-center gap-2 mb-4">
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{product.originalPrice}
            </span>
          )}
          <span className="text-base font-bold text-gray-900">
            ৳{product.price}
          </span>
        </div>
        <Link
          href={`/product/${product.slug}`}
          className="w-full block text-center bg-[#0B1221] text-white text-[10px] font-black py-4 rounded-2xl hover:bg-blue-600 transition-all duration-300 cursor-pointer uppercase tracking-[0.2em] shadow-lg shadow-black/5 hover:shadow-blue-500/25 active:scale-[0.98]"
          aria-label={`View details for ${product.name}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

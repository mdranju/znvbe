"use client";

import { useGetWishlistQuery } from "@/src/store/api/wishlistApi";
import { ProductCard } from "@/components/product/ProductCard";
import { BackButton } from "@/components/common/BackButton";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { Heart } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

export default function WishlistPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: wishlistItems = [], isLoading } = useGetWishlistQuery(
    undefined,
    { skip: !isAuthenticated },
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32 pt-10">
        {/* 1. Wishlist Hero (Mobile Only) */}
        <div className="relative h-[20vh] lg:h-[30vh] flex lg:hidden items-center justify-center overflow-hidden bg-[#0B1221] mb-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

          <div className="relative z-10 text-center px-6">
            <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
              Favorites
            </p>
            <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
              My Wishlist.
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start relative">
            <ProfileSidebar />

            <div className="flex-1 w-full relative space-y-12">
              <div className="flex items-center justify-between mb-8">
                <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-blue-600" />
                  <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
                    {wishlistItems.length} Saved Items
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-white rounded-[2rem] aspect-[3/4] border border-black/5"
                      />
                    ))}
                </div>
              ) : wishlistItems.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {wishlistItems.map((item, idx) => (
                    <div
                      key={item.product?._id || item.product?.id || idx}
                      className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <ProductCard product={item.product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 glass-card rounded-[4rem] bg-white border border-black/5 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-10 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-blue-600/5 scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full" />
                    <Heart
                      size={32}
                      className="text-[#0B1221]/10 relative z-10"
                      strokeWidth={1}
                    />
                  </div>
                  <h3 className="hero-display text-4xl tracking-tighter text-[#0B1221] mb-4 uppercase">
                    Wishlist is Empty.
                  </h3>
                  <p className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed mb-12">
                    You haven&apos;t saved any premium pieces yet. Start
                    discovering our collection.
                  </p>
                  <Link
                    href="/products"
                    className="btn-glow px-12 py-5 bg-[#0B1221] text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-2xl shadow-black/20"
                  >
                    Explore Collection
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

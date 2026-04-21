"use client";
import { resolveImageUrl } from "@/src/utils/image";

import { SITE_CONFIG } from "@/src/config/site";
import { useCMS } from "@/src/hooks/useCMS";
import { useScroll } from "@/src/hooks/useScroll";
import {
  useGetCategoriesQuery,
  useGetSubcategoriesQuery,
} from "@/src/store/api/categoryApi";
import { useGetWishlistQuery } from "@/src/store/api/wishlistApi";
import { setCartOpen } from "@/src/store/slices/uiSlice";
import { RootState } from "@/src/store/store";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchBar } from "./SearchBar";

const MobileMenu = dynamic(
  () => import("./MobileMenu").then((mod) => mod.MobileMenu),
  { ssr: false },
);
const CartSidebar = dynamic(
  () => import("./CartSidebar").then((mod) => mod.CartSidebar),
  { ssr: false },
);
const SearchModal = dynamic(
  () => import("./SearchModal").then((mod) => mod.SearchModal),
  { ssr: false },
);

export function Header() {
  const { metadata, getImageUrl } = useCMS();
  const { data: dynamicCategories = [] } = useGetCategoriesQuery({
    status: "active",
  });
  const { data: allSubcategories = [] } = useGetSubcategoriesQuery({
    status: "active",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const { isAtTop, scrolled, isVisible } = useScroll(0);
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity,
  );
  const isCartOpen = useSelector((state: RootState) => state.ui.isCartOpen);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: wishlistItems = [] } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (totalQuantity > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  // ... inside Header ...
  const showGlass = scrolled || isSearchFocused;
  const headerLogoUrl = metadata?.headerLogo?.url
    ? resolveImageUrl(metadata.headerLogo.url)
    : "/logo.svg";

  return (
    <>
      <header
        className={`sticky top-0 z-[999] w-full transition-all duration-500 ease-in-out
           ${
             showGlass
               ? "bg-white border-b border-white/20 shadow-sm"
               : "bg-white border-b border-gray-100"
           } 
        
        ${!isVisible || isSearchModalOpen ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        <div
          className={`transition-all duration-700 ${showGlass ? "py-1.5" : "py-3"}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center lg:hidden">
                <button
                  className="p-3 text-gray-900 bg-gray-50 border border-black/5 rounded-2xl active:scale-95 transition-all"
                  onClick={() => setIsMenuOpen(true)}
                  aria-label="Toggle mobile menu"
                >
                  <div className="flex flex-col gap-1.5 items-start">
                    <div className="w-6 h-0.5 bg-[#0B1221] rounded-full" />
                    <div className="w-4 h-0.5 bg-[#0B1221] rounded-full" />
                    <div className="w-6 h-0.5 bg-[#0B1221] rounded-full" />
                  </div>
                </button>
              </div>

              <Link href="/" className="flex items-center shrink-0 group">
                <Image
                  src={headerLogoUrl}
                  alt={`${SITE_CONFIG.name} Logo`}
                  width={160}
                  height={60}
                  priority
                  className="w-auto h-10 lg:h-14 object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="hidden lg:flex flex-1 max-w-xl">
                <SearchBar
                  scrolled={scrolled}
                  onFocusChange={(focused) => setIsSearchFocused(focused)}
                />
              </div>

              <div className="flex items-center gap-3 lg:gap-6 shrink-0">
                <Link
                  href={isAuthenticated ? "/profile" : "/login"}
                  className="hidden lg:flex items-center gap-3 py-2 px-4 rounded-2xl hover:bg-gray-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-black/5 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                    <User
                      size={18}
                      className="text-[#0B1221]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 leading-none mb-1">
                      {isAuthenticated ? "My Account" : "Sign In"}
                    </span>
                    <span className="text-sm font-bold text-[#0B1221]">
                      Profile
                    </span>
                  </div>
                </Link>

                <div className="w-px h-6 bg-gray-100 hidden lg:block" />

                <div className="flex items-center gap-2 lg:gap-3">
                  {/* Wishlist Icon */}
                  <Link
                    href="/wishlist"
                    className="relative p-3 rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-red-500 border border-black/5 transition-all duration-500 group"
                    aria-label={`View wishlist, ${wishlistItems.length} items`}
                  >
                    <Heart
                      size={20}
                      className="text-[#0B1221] transition-colors group-hover:text-red-500"
                      strokeWidth={1.5}
                      fill={wishlistItems.length > 0 ? "currentColor" : "none"}
                    />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in-50 duration-300">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>

                  {/* Cart Icon */}
                  <button
                    onClick={() => dispatch(setCartOpen(true))}
                    className={`relative p-3 rounded-2xl bg-[#0B1221] hover:bg-black transition-all duration-500 shadow-xl shadow-black/10 ${isBouncing ? "animate-cart-bounce" : ""}`}
                    aria-label={`Open shopping cart, ${totalQuantity} items`}
                  >
                    <ShoppingBag
                      size={20}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                      {totalQuantity}
                    </span>
                  </button>

                  <button
                    className="lg:hidden p-3 text-[#0B1221] bg-gray-50 rounded-xl"
                    onClick={() => setIsSearchModalOpen(true)}
                    aria-label="Open search search modal"
                  >
                    <Search size={20} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isAtTop && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block border-t border-black/[0.03] relative bg-white/5 backdrop-blur-2xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12 relative overflow-visible">
                <div className="overflow-x-auto no-scrollbar scroll-smooth">
                  <nav className="flex items-center justify-start lg:justify-center gap-x-12 min-w-max py-2.5 h-12">
                    {(dynamicCategories.length > 0
                      ? dynamicCategories.filter(
                          (c) =>
                            c.status === "active" && c.showInHeader === true,
                        )
                      : []
                    ).map((category: any) => {
                      const relevantSubs = category.subcategories || [];

                      return (
                        <div
                          key={category._id}
                          className="group/item relative h-full flex items-center"
                        >
                          <Link
                            href={`/category/${category.slug}`}
                            className="text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap text-[#0B1221] hover:text-blue-600 flex items-center gap-1.5"
                          >
                            {category.name}
                            {relevantSubs.length > 0 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600/20 group-hover/item:bg-blue-600 transition-colors" />
                            )}
                          </Link>

                          {relevantSubs.length > 0 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover/item:opacity-100 group-hover/item:pointer-events-auto transition-all duration-300 transform group-hover/item:translate-y-0 translate-y-2 z-[1001]">
                              <div className="bg-white/80 backdrop-blur-3xl border border-black/5 rounded-[2rem] p-6 shadow-2xl min-w-[200px] border-t-4 border-t-blue-600">
                                <div className="space-y-3">
                                  {relevantSubs.map((sub: any) => (
                                    <Link
                                      key={sub._id}
                                      href={`/category/${category.slug}?subcategory=${sub.slug}`}
                                      className="block text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-blue-600 transition-colors py-1"
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 transition-transform duration-500 origin-center scale-x-0 group-hover/item:scale-x-100" />
                        </div>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
        cartItems={cartItems}
      />

      <AnimatePresence>
        {isSearchModalOpen && (
          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

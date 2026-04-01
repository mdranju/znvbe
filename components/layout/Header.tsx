"use client";

import { Search, User, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { setCartOpen } from "@/src/store/slices/uiSlice";
import dynamic from "next/dynamic";
import { SearchBar } from "./SearchBar";
import Image from "next/image";
import { categories } from "@/lib/data";
import { AnimatePresence } from "motion/react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity,
  );
  const isCartOpen = useSelector((state: RootState) => state.ui.isCartOpen);

  useEffect(() => {
    if (totalQuantity > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  // Combined scroll logic: Desktop glass effect + Mobile smart hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 1024;

      // Update glass theme effect
      setScrolled(currentScrollY > 60);

      // Smart hide/show for mobile only
      if (isMobile) {
        const delta = currentScrollY - lastScrollY;
        const scrollThreshold = 10;

        if (Math.abs(delta) > scrollThreshold) {
          if (currentScrollY > lastScrollY && currentScrollY > 120) {
            // Scrolling Down - Hide
            setIsVisible(false);
          } else {
            // Scrolling Up - Show
            setIsVisible(true);
          }
        }
      } else {
        setIsVisible(true); // Ensure visible on desktop resize
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const showGlass = scrolled || isSearchFocused;

  return (
    <>
      <header
        className={`sticky top-0 z-[999] w-full transition-all duration-500 ease-in-out
           ${
             showGlass
               ? "bg-white border-b border-white/20"
               : "bg-white border-b border-gray-100"
           } 
        
        ${!isVisible || isSearchModalOpen ? "-translate-y-full" : "translate-y-0"}
        `}
      >
        {/* 1. Primary Header Row */}
        <div
          className={`transition-all duration-700 ${showGlass ? "py-2" : "py-4"}`}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between gap-8">
              {/* Mobile Menu Trigger */}
              <div className="flex items-center lg:hidden">
                <button
                  className="p-3 text-gray-900 bg-gray-50 border border-black/5 rounded-2xl active:scale-95 transition-all"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <div className="flex flex-col gap-1.5 items-start">
                    <div className="w-6 h-0.5 bg-[#0B1221] rounded-full" />
                    <div className="w-4 h-0.5 bg-[#0B1221] rounded-full" />
                    <div className="w-6 h-0.5 bg-[#0B1221] rounded-full" />
                  </div>
                </button>
              </div>

              {/* Logo */}
              <Link href="/" className="flex items-center shrink-0 group">
                <Image
                  src="/logo.svg"
                  alt="Avlora Wear Logo"
                  width={160}
                  height={60}
                  priority
                  className="w-auto h-10 lg:h-12 object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-xl">
                <SearchBar
                  scrolled={scrolled}
                  onFocusChange={(focused) => setIsSearchFocused(focused)}
                />
              </div>

              {/* Actions: Profile & Cart */}
              <div className="flex items-center gap-4 lg:gap-8 shrink-0">
                <Link
                  href="/login"
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
                      Sign In
                    </span>
                    <span className="text-sm font-bold text-[#0B1221]">
                      Profile
                    </span>
                  </div>
                </Link>

                <div className="w-px h-6 bg-gray-100 hidden lg:block" />

                <button
                  onClick={() => dispatch(setCartOpen(true))}
                  className={`relative p-3 rounded-2xl bg-[#0B1221] hover:bg-black transition-all duration-500 shadow-xl shadow-black/10 ${isBouncing ? "animate-cart-bounce" : ""}`}
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
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Premium Category Navigation (Mega Menu) */}
        <div className="hidden lg:block border-t border-black/[0.03] relative bg-white/5 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 relative overflow-visible">
            {/* Scroll Indicator Fades */}
            <div className="absolute left-10 top-0 bottom-0 w-20 bg-gradient-to-r  pointer-events-none z-10" />
            <div className="absolute right-10 top-0 bottom-0 w-20 bg-gradient-to-l  pointer-events-none z-10" />

            <div className="overflow-x-auto no-scrollbar scroll-smooth">
              <nav className="flex items-center justify-start lg:justify-center gap-x-12 min-w-max py-4 h-14">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="group/item relative h-full flex items-center"
                  >
                    <Link
                      href={`/category/${category.slug}`}
                      className="text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap text-[#0B1221] hover:text-blue-600"
                    >
                      {category.name}
                    </Link>

                    {/* Animated Underline */}
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 transition-transform duration-500 origin-center scale-x-0 group-hover/item:scale-x-100" />
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
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

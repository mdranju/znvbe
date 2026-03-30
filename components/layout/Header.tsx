"use client";

import { Search, User, ShoppingBag, Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { setCartOpen } from "@/src/store/slices/uiSlice";
import { MobileMenu } from "./MobileMenu";
import { CartSidebar } from "./CartSidebar";
import { SearchBar } from "./SearchBar";
import { SearchModal } from "./SearchModal";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
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

  // Desktop-only scroll glass effect
  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth >= 1024) setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showGlass = scrolled || isSearchFocused;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-700 ${showGlass ? "bg-white/70 backdrop-blur-3xl shadow-sm border-b border-white/20" : "bg-white border-b border-gray-100"}`}
      >
        {/* 1. Announcement Bar */}
        <div className="bg-[#0B1221] text-white py-2.5 px-4 text-center overflow-hidden relative group hidden sm:block">
          <div className="flex items-center justify-center gap-8 animate-infinite-scroll">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
              New Collection - Live Now.
            </p>
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
              Free Delivery on Orders Over $150.
            </p>
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity">
              Secure Shopping Active.
            </p>
          </div>
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl -z-10" />
        </div>

        <div
          className={`transition-all duration-700 ${showGlass ? "py-3" : "py-6"}`}
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center lg:hidden">
                <button
                  className="p-3.5 -ml-2 text-gray-900 bg-gray-50/80 backdrop-blur-xl border border-black/5 rounded-2xl hover:bg-white active:scale-95 transition-all duration-300"
                  onClick={() => setIsMenuOpen(true)}
                >
                  <div className="flex flex-col gap-1.5 items-start">
                    <div className="w-6 h-0.5 bg-[#0B1221] rounded-full" />
                    <div className="w-4 h-0.5 bg-[#0B1221] rounded-full group-hover:w-6 transition-all" />
                    <div className="w-6 h-0.5 bg-[#0B1221] rounded-full" />
                  </div>
                </button>
              </div>

              <Link href="/" className="flex items-center gap-3 shrink-0 group">
                <div className="w-11 h-11 bg-[#0B1221] rounded-[14px] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-black/5 group-hover:scale-105 transition-transform duration-500">
                  A
                </div>
                <div className="flex flex-col -gap-1">
                  <span className="text-xl font-black tracking-tighter text-[#0B1221] leading-none">
                    Avlora.
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30 mt-0.5">
                    Est. 2026
                  </span>
                </div>
              </Link>

              <div className="hidden lg:flex flex-1 max-w-xl mx-auto">
                <SearchBar
                  scrolled={scrolled}
                  onFocusChange={(focused) => setIsSearchFocused(focused)}
                />
              </div>

              <div className="flex items-center gap-3 lg:gap-10 shrink-0">
                <Link
                  href="/login"
                  className="hidden lg:flex items-center gap-4 group transition-all"
                >
                  <div className="w-12 h-12 rounded-[18px] bg-gray-50 border border-black/5 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl group-hover:shadow-black/5 transition-all duration-500">
                    <User
                      size={20}
                      className="text-[#0B1221]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0B1221]/40 leading-none mb-1">
                      Log In
                    </span>
                    <span className="text-sm font-bold text-[#0B1221]">
                      Profile
                    </span>
                  </div>
                </Link>

                <div className="w-px h-8 bg-gray-100 hidden lg:block" />

                <button
                  onClick={() => dispatch(setCartOpen(true))}
                  className={`relative p-3 rounded-2xl bg-gray-50 border border-black/5 hover:bg-white hover:shadow-xl hover:shadow-black/5 transition-all duration-500 ${isBouncing ? "animate-cart-bounce" : ""}`}
                >
                  <ShoppingBag
                    size={22}
                    className="text-[#0B1221]"
                    strokeWidth={1.5}
                  />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#0B1221] text-white text-[11px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110">
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
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
        cartItems={cartItems}
      />

      {/* Mobile Search Modal for Product Page */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}

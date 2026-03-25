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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
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

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 text-gray-600"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center text-white font-bold text-xl">
                b
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Bangladesh
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1">
              <SearchBar />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 lg:gap-8 shrink-0">
              <Link
                href="/login"
                className="hidden lg:flex items-center gap-2 hover:text-gray-600"
              >
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50">
                  <User size={20} className="text-gray-600" />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="text-gray-500 text-xs text-left">
                    Sign In
                  </span>
                  <span className="font-medium">Your Account</span>
                </div>
              </Link>

              <button
                onClick={() => dispatch(setCartOpen(true))}
                className={`relative p-2 hover:text-gray-600 ${isBouncing ? "animate-cart-bounce" : ""}`}
              >
                <ShoppingBag size={24} />
                <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                  {totalQuantity}
                </span>
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="mt-4 lg:hidden">
            <SearchBar isMobile />
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => dispatch(setCartOpen(false))}
        cartItems={cartItems}
      />
    </>
  );
}

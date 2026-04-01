"use client";

import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { setCartOpen } from "@/src/store/slices/uiSlice";

export function MobileBottomNav() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity,
  );

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      name: "Categories",
      href: "/categories",
      icon: LayoutGrid,
      isActive:
        pathname === "/categories" || pathname?.startsWith("/category/"),
    },
    {
      name: "Cart",
      href: "#", // Handled by onClick
      icon: ShoppingBag,
      isActive: false, // Cart is a slide-over, so it doesn't have an active route state
      badge: totalQuantity > 0 ? totalQuantity : null,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        dispatch(setCartOpen(true));
      },
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      isActive: pathname?.startsWith("/profile") || pathname === "/login",
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-2 left-4 right-4 z-50 px-4">
      <nav className="flex justify-around items-center h-16 bg-white/80 backdrop-blur-3xl border border-black/5 rounded-[2.5rem] shadow-2xl px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const activeClass = item.isActive
            ? "text-blue-600"
            : "text-[#0B1221]/30 hover:text-[#0B1221]";

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={item.onClick}
              aria-label={
                item.name === "Cart"
                  ? `Open shopping cart. ${totalQuantity} items.`
                  : `Navigate to ${item.name}`
              }
              aria-current={item.isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-500 scale-95 hover:scale-100 ${activeClass}`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-all duration-500 ${item.isActive ? "stroke-[2.5px] -translate-y-1" : "stroke-[1.5px]"}`}
                  aria-hidden="true"
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border border-white shadow-xl">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                {/* Active Indicator Dot */}
                {item.isActive && (
                  <div className="absolute -bottom-1 left-1.5 w-1 h-1 bg-current rounded-full" />
                )}
              </div>
              <span
                className={`text-[9px] font-black uppercase tracking-widest transition-opacity ${item.isActive ? "opacity-100" : "opacity-40"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

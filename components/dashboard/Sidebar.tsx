"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  Zap,
  MessageSquare,
  FileText,
  Tag,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/src/store/slices/authSlice";
import { premiumToast as toast } from "@/components/ui/PremiumToast";
import { useCMS } from "@/src/hooks/useCMS";
import { resolveImageUrl } from "@/src/utils/image";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: ShoppingBag, label: "Products", path: "/dashboard/products" },
  { icon: Layers, label: "Categories", path: "/dashboard/categories" },
  {
    icon: MessageSquare,
    label: "Subcategories",
    path: "/dashboard/subcategories",
  },
  { icon: Tag, label: "Orders", path: "/dashboard/orders" },
  { icon: ImageIcon, label: "Banners", path: "/dashboard/banners" },
  { icon: Zap, label: "Marquee", path: "/dashboard/marquee" },
  { icon: Users, label: "Users", path: "/dashboard/users" },
  { icon: FileText, label: "Pages", path: "/dashboard/pages" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { metadata } = useCMS();

  const handleLogout = () => {
    dispatch(logout());
    toast.info("Logged Out", {
      description: "You have been successfully signed out of the dashboard.",
    });
  };

  const dashboardLogoUrl = metadata?.dashboardLogo?.url
    ? resolveImageUrl(metadata.dashboardLogo.url)
    : null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-black/5 flex flex-col z-[1100]">
      {/* Brand Logo */}
      <div className="h-24 flex items-center px-10 border-b border-black/5">
        <Link href="/" className="flex items-center gap-3">
          {dashboardLogoUrl ? (
            <img
              src={dashboardLogoUrl}
              alt="Logo"
              className="h-14 w-full object-cover"
            />
          ) : (
            <>
              <div className="w-10 h-10 bg-[#0B1221] rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                <span className="text-white text-xl font-black italic">Z.</span>
              </div>
              <span className="text-xl font-black text-[#0B1221] tracking-tighter">
                ZNVBE <span className="text-blue-600">.</span>
              </span>
            </>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-10 px-6 space-y-2 overflow-y-auto no-scrollbar">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6">
          Execution Panel
        </p>

        {MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/dashboard" && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? "bg-[#0B1221] text-white shadow-xl shadow-black/10"
                  : "text-[#0B1221]/40 hover:text-[#0B1221] hover:bg-gray-50"
              }`}
            >
              <Icon
                size={20}
                className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
              />
              <span
                className={`text-sm font-bold tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-black/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm tracking-tight"
        >
          <LogOut size={20} />
          <span>Exit Interface</span>
        </button>
      </div>
    </aside>
  );
}

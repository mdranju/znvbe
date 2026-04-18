import Link from "next/link";
import { Phone } from "lucide-react";
import { categories } from "@/lib/data";

export function Navigation() {
  return (
    <nav className="hidden lg:block border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 text-sm font-medium text-gray-700">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/products?search=${category.slug}`}
                className="hover:text-black flex items-center gap-1"
              >
                {category.name}
                {[
                  "Panjabi",
                  "T-shirt",
                  "Pant & Trouser",
                  "Attar",
                  "Gadgets",
                  "Sneakers",
                  "Natural Foods",
                  "Winter",
                  "Combo Offers",
                ].includes(category.name) && (
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 text-[#0B1221] shrink-0 ml-4">
          <Phone size={18} className="text-blue-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Hotline:</span>
            <span className="font-bold text-sm">09638090000</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Panjabi", img: "/mini.jpg" },
  { name: "Shirt", img: "/template.jpg" },
  { name: "T-shirt", img: "https://picsum.photos/seed/cat3/1000/1000" },
  { name: "Polo", img: "https://picsum.photos/seed/cat4/1000/1000" },
  { name: "Pant", img: "https://picsum.photos/seed/cat5/1000/1000" },
  { name: "Perfume", img: "https://picsum.photos/seed/cat6/1000/1000" },
  { name: "Gadget", img: "https://picsum.photos/seed/cat7/1000/1000" },
  { name: "Sneaker", img: "https://picsum.photos/seed/cat8/1000/1000" },
  { name: "Food", img: "https://picsum.photos/seed/cat9/1000/1000" },
  { name: "Watch", img: "https://picsum.photos/seed/cat10/1000/1000" },
  { name: "Bag", img: "https://picsum.photos/seed/cat11/1000/1000" },
  { name: "Cap", img: "https://picsum.photos/seed/cat12/1000/1000" },
];

function TopCategories() {
  return (
    <>
      {/* ── Top Categories ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-0">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 text-xs font-extrabold tracking-[0.2em] uppercase mb-2">
              Browse
            </p>
            <h2 className="premium-section-title">Explore Categories</h2>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
          >
            View All{" "}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
        <div className="category-grid-desktop grid lg:grid-cols-6 md:grid-cols-4 grid-cols-4 gap-4 lg:gap-8 lg:-mb-4">
          {categories.map((cat, i) => (
            <Link
              key={i}
              href={`/category/${cat.name?.toLowerCase()?.replace(" ", "-")}`}
              className="category-item-desktop flex flex-col items-center group"
            >
              <div className="w-full aspect-square lg:rounded-[1.5rem] rounded-[1rem] overflow-hidden bg-gray-50 border border-gray-100 relative mb-4 transition-all duration-500 group-hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.3)] group-hover:-translate-y-2">
                <Image
                  width={500}
                  height={500}
                  src={cat.img}
                  alt={cat.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-500" />
              </div>
              <span className="text-sm font-bold text-gray-900 tracking-tight transition-colors group-hover:text-blue-600">
                {cat.name}
              </span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                View Products
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default TopCategories;

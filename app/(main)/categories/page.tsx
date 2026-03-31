import { categories } from "@/lib/data";
import { BackButton } from "@/components/common/BackButton";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "All Categories | Avlora Wear",
  description: "Browse all product categories at Avlora Wear.",
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]/50">
      {/* 1. Category Hero */}
      <div className="relative h-[45vh] lg:h-[30vh] flex items-center justify-center overflow-hidden bg-[#0B1221]">
        {/* Ambient Mesh Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all duration-300" />
          </div>
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-4 animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
            Our Collections
          </p>
          <h1 className="hero-display text-5xl lg:text-9xl tracking-tighter text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            All Categories.
          </h1>
          <p className="mt-8 text-white/30 text-[10px] font-black uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            Choose a category to browse our complete collection of products.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-10 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-12">
          {categories.map((category, idx) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative h-[320px] lg:h-[400px] flex items-end p-10 bg-white border border-black/5 rounded-[3rem] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Category Initial Background */}
              <div className="absolute top-12 left-10 text-[12rem] lg:text-[16rem] font-black text-[#0B1221]/5 leading-none transition-transform duration-1000 group-hover:scale-110 group-hover:-translate-y-4">
                {category.name.charAt(0)}
              </div>

              {/* Content */}
              <div className="relative z-10 w-full space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-blue-600 transition-all duration-700 group-hover:w-12" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                    Collection {idx + 1}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="hero-display text-3xl lg:text-4xl tracking-tighter text-[#0B1221] group-hover:translate-x-2 transition-transform duration-700">
                    {category.name}.
                  </h3>
                  <ChevronRight
                    size={20}
                    className="text-[#0B1221]/20 group-hover:text-blue-600 group-hover:translate-x-2 transition-all duration-700"
                    strokeWidth={1.5}
                  />
                </div>

                <p className="text-[10px] font-black text-[#0B1221]/30 uppercase tracking-widest pt-4 border-t border-black/5">
                  View Products
                </p>
              </div>

              {/* Hover Glow Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </Link>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-40 pt-20 border-t border-black/5 flex flex-col items-center">
          <div className="w-px h-24 bg-gradient-to-b from-blue-600 to-transparent opacity-30 mb-12" />
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#0B1221]/20 text-center px-12 leading-relaxed">
            Avlora Wear Worldwide. <br /> Secure Shopping Active.
          </p>
        </div>
      </div>
    </div>
  );
}

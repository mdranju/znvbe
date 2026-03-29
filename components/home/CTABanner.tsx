import { ArrowRight } from "lucide-react";
import Link from "next/link";

function CTABanner() {
  return (
    <section className="cta-banner-desktop max-w-7xl mx-auto w-full px-4 lg:px-0">
      <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-[#0B1221] px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24 text-center border border-blue-500/10 shadow-3xl group">
        {/* Ambient glow blobs - Adjusted for responsiveness */}
        <div className="absolute desktop-glow-blob w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-blue-600/10 lg:bg-blue-600/20 -top-20 -left-20 lg:-top-48 lg:-left-48 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute desktop-glow-blob w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-indigo-600/10 lg:bg-indigo-600/20 -bottom-20 -right-20 lg:-bottom-48 lg:-right-48 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-blue-500 text-[10px] md:text-xs font-black tracking-[0.4em] uppercase mb-4 lg:mb-6 animate-pulse">
            Limited Time Offer
          </p>

          <h2 className="hero-display text-white text-3xl md:text-5xl lg:text-7xl mb-6 lg:mb-8 font-black leading-[1.1] max-w-4xl">
            Eid Collection 2026
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              New Collections
            </span>
          </h2>

          <p className="text-white/50 text-sm md:text-base lg:text-lg max-w-2xl mx-auto mb-10 lg:mb-12 font-medium leading-relaxed px-4">
            Explore our exclusive Eid range — high quality fabrics, timeless
            designs, crafted specifically for your celebration. Experience
            luxury in every thread.
          </p>

          <Link
            href="/products"
            className="btn-glow inline-flex items-center gap-4 bg-white text-[#0B1221] px-8 md:px-12 py-4 md:py-6 rounded-2xl font-black text-[11px] md:text-[13px] transition-all hover:scale-105 shadow-2xl uppercase tracking-[0.2em] group/btn active:scale-95"
          >
            View Collection
            <div className="w-8 h-8 rounded-full bg-[#0B1221] flex items-center justify-center text-white group-hover/btn:translate-x-1 transition-transform">
              <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        {/* Subtle Decorative Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

export default CTABanner;

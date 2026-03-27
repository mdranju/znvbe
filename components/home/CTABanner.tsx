import { ArrowRight } from "lucide-react";
import Link from "next/link";

function CTABanner() {
  return (
    <>
      {/* ── CTA Banner (Desktop Only) ────────────────────────── */}
      <section className="cta-banner-desktop hidden lg:block max-w-7xl mx-auto w-full px-4 lg:px-6">
        <div className="relative overflow-hidden rounded-[3rem] bg-[#0B1221] px-20 py-24 text-center border border-blue-500/10 shadow-2xl">
          {/* Ambient glow blobs */}
          <div className="desktop-glow-blob w-[500px] h-[500px] bg-blue-600/20 -top-48 -left-48" />
          <div className="desktop-glow-blob w-[500px] h-[500px] bg-indigo-600/20 -bottom-48 -right-48" />
          <div className="relative z-10">
            <p className="text-blue-500 text-xs font-black tracking-[0.5em] uppercase mb-6">
              Limited Time Offer
            </p>
            <h2 className="hero-display text-white text-5xl xl:text-6xl mb-8">
              Eid Collection 2026
              <br />
              <span className="text-blue-500">New Collections</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Explore our exclusive Eid range — high quality fabrics, timeless
              designs, crafted specifically for your celebration.
            </p>
            <Link
              href="/products"
              className="btn-glow inline-flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all border border-blue-400/30 shadow-2xl shadow-blue-600/30 uppercase tracking-widest"
            >
              View Collection <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default CTABanner;

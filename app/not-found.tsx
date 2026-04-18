"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SITE_CONFIG } from "@/src/config/site";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fdfdfd] px-6 py-20 lg:py-32">
      {/* ── Ambient Background Elements ───────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none">
        {/* Soft Ambient Glows - Very Subtle */}
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px]" />
        
        {/* Premium Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
        
        {/* Radial Fade Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#fdfdfd_85%)]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center pb-24 md:pb-0">
        
        {/* ── 404 Large Backdrop ─────────────────────────────── */}
        <div className="relative mb-6 lg:mb-0">
          <h1 className="hero-display text-[100px] sm:text-[180px] md:text-[240px] lg:text-[320px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-600/[0.08] to-transparent select-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pt-10">
            <span className="text-blue-600/30 text-[9px] md:text-xs font-black tracking-[1.8em] uppercase pl-[1.8em] whitespace-nowrap">
              Collection Not Found
            </span>
          </div>
        </div>

        {/* ── Content Section ─────────────────────────────────── */}
        <div className="space-y-8 -mt-4 sm:-mt-8 md:-mt-12">
          <div className="space-y-4">
            <h2 className="hero-display text-[#0B1221] text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
              Lost In <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 via-indigo-500 to-blue-400">Pure Style.</span>
            </h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>
          
          <p className="text-[#0B1221]/40 text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed font-medium px-6">
            The masterpiece you&apos;re looking for has moved to a more exclusive aisle. 
            Allow us to guide you back to our main showcase.
          </p>
        </div>

        {/* ── Interactive CTA ─────────────────────────────────── */}
        <div className="mt-14 flex flex-col sm:flex-row items-center gap-6">
          <Link
            href="/"
            className="btn-glow inline-flex items-center gap-5 bg-[#0B1221] text-white px-10 py-5 rounded-2xl font-black text-[11px] md:text-[12px] transition-all hover:scale-105 shadow-[0_20px_40px_rgba(0,0,0,0.15)] uppercase tracking-[0.25em] group/btn active:scale-95"
          >
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm group-hover/btn:bg-white group-hover/btn:text-[#0B1221] transition-all duration-500">
               <ArrowLeft size={18} className="transition-transform group-hover/btn:-translate-x-1" />
            </div>
            Back to Home
          </Link>

          <Link
            href="/products"
            className="group flex items-center gap-3 text-[#0B1221]/70 hover:text-[#0B1221] font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-500 py-2 sm:py-0"
          >
            <span>Browse New Arrivals</span>
            <div className="w-2 h-2 rounded-full border border-blue-500 scale-50 group-hover:scale-100 group-hover:bg-blue-500 transition-all duration-500" />
          </Link>
        </div>

        {/* ── Branding Footer ─────────────────────────────────── */}
        <div className="mt-24 pointer-events-none transition-opacity duration-1000">
           <p className="text-[#0B1221]/10 text-[8px] md:text-[9px] font-black tracking-[1.2em] uppercase">
             {SITE_CONFIG.name} · {new Date().getFullYear()}
           </p>
           <div className="mt-5 flex justify-center items-center gap-4">
             <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#0B1221]/10 to-transparent" />
             <div className="w-1.5 h-1.5 rotate-45 border border-[#0B1221]/20" />
             <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#0B1221]/10 to-transparent" />
           </div>
        </div>
      </div>
    </div>
  );
}

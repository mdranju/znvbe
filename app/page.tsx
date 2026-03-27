"use client";

import { DesktopAnimations } from "@/components/desktop/DesktopAnimations";
import CTABanner from "@/components/home/CTABanner";
import HeroBanner from "@/components/home/HeroBanner";
import MarqueeTicker from "@/components/home/MarqueeTicker";
import ProductItemsSection from "@/components/home/ProductItemsSection";
import TopCategories from "@/components/home/TopCategories";

export default function Home() {
  return (
    <>
      {/* GSAP animations — desktop only, pure side-effect */}
      <DesktopAnimations />

      <div className="flex flex-col lg:gap-12 gap-8 lg:pb-12 pb-20 ">
        {/* ── Hero Banner ─────────────────────────────────────── */}
        <HeroBanner />

        {/* ── Marquee Ticker (Desktop Only) ──────────────────── */}
        <MarqueeTicker />

        {/* ── Top Categories ──────────────────────────────────── */}
        <TopCategories />

        {/* ── Filter Products Section ─────────────────────────────────── */}
        <ProductItemsSection />

        {/* ── CTA Banner (Desktop Only) ────────────────────────── */}
        <CTABanner />
      </div>
    </>
  );
}

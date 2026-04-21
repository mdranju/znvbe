import dynamic from "next/dynamic";
import HeroBanner from "@/components/home/HeroBanner";
import { SITE_CONFIG } from "@/src/config/site";
import { DesktopAnimations } from "@/components/desktop/DesktopAnimations";

const MarqueeTicker = dynamic(() => import("@/components/home/MarqueeTicker"), {
  ssr: true,
});
const TopCategories = dynamic(() => import("@/components/home/TopCategories"), {
  ssr: true,
});
const ProductItemsSection = dynamic(
  () => import("@/components/home/ProductItemsSection"),
  { ssr: true },
);
const FeaturedProducts = dynamic(
  () => import("@/components/home/FeaturedProducts"),
  { ssr: true },
);
const NewArrivals = dynamic(() => import("@/components/home/NewArrivals"), {
  ssr: true,
});
const CTABanner = dynamic(() => import("@/components/home/CTABanner"), {
  ssr: true,
});

async function getInitialData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const bannersRes = await fetch(`${apiUrl}/banner?status=active&type=hero`, {
      next: { revalidate: 3600 },
    });
    const banners = await bannersRes.json();
    return {
      heroBanners: banners?.data || [],
    };
  } catch (error) {
    console.error("Server-side fetch error:", error);
    return { heroBanners: [] };
  }
}

export default async function Home() {
  const data = await getInitialData();

  return (
    <>
      {/* ── SEO: Screen Reader H1 ── */}
      <h1 className="sr-only">
        {SITE_CONFIG?.meta?.title || "ZNVBE"} | Premium Streetwear & Fashion
        Collection
      </h1>

      {/* GSAP animations — desktop only */}
      <DesktopAnimations />

      <div className="flex flex-col lg:gap-10 gap-8 lg:pb-12 pb-20 ">
        {/* ── Hero Banner ─────────────────────────────────────── */}
        <HeroBanner initialBanners={data.heroBanners} />

        {/* ── Marquee Ticker (Desktop Only) ──────────────────── */}
        <MarqueeTicker />

        {/* ── Top Categories ──────────────────────────────────── */}
        <TopCategories />

        {/* ── Top Featured ──────────────────────────────────── */}
        <FeaturedProducts />

        {/* ── New Arrivals ──────────────────────────────────── */}
        <NewArrivals />

        {/* ── Filter Products Section ─────────────────────────────────── */}
        <ProductItemsSection />

        {/* ── CTA Banner (Desktop Only) ────────────────────────── */}
        <CTABanner />
      </div>
    </>
  );
}

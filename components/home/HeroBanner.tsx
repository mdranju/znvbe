"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    image: "https://picsum.photos/seed/hero1/1920/900",
    alt: "Eid Special Collection 1",
  },
  { id: 2, image: "/banner-ranju.jpg", alt: "Eid Special Collection 2" },
  {
    id: 3,
    image: "https://picsum.photos/seed/hero3/1920/900",
    alt: "Eid Special Collection 3",
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/hero4/1920/900",
    alt: "New Season 4",
  },
  {
    id: 5,
    image: "https://picsum.photos/seed/hero7/1920/900",
    alt: "New Season 5",
  },
  { id: 6, image: "/banner.jpg", alt: "Believers Banner" },
];

function HeroBanner() {
  return (
    <>
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 lg:px-0">
        <div className="relative w-full aspect-[21/10] md:aspect-[21/10]  lg:rounded-[2rem] rounded-[1rem] overflow-hidden lg:mt-12 mt-4 border border-white/10 group">
          {/* Ambient Inner Glow (Desktop) */}
          <div className="absolute inset-0 pointer-events-none  z-10 rounded-[1rem]" />

          <Swiper
            spaceBetween={0}
            centeredSlides={true}
            speed={1200}
            loop={true}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              dynamicBullets: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            className="w-full h-full hero-swiper"
          >
            {/* Premium Navigation Arrows */}
            <div className="swiper-button-prev-custom absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-[1.5rem] bg-white/5 backdrop-blur-xl border border-white/10 !text-white cursor-pointer opacity-0 lg:group-hover:opacity-100 transition-all duration-700 hover:bg-white/20 hover:border-white/30 hover:scale-105 shadow-2xl after:content-none group/btn !m-0">
              <IoIosArrowBack
                size={24}
                className="group-hover/btn:-translate-x-1 transition-transform duration-300"
              />
            </div>
            <div className="swiper-button-next-custom absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-[1.5rem] bg-white/5 backdrop-blur-xl border border-white/10 !text-white cursor-pointer opacity-0 lg:group-hover:opacity-100 transition-all duration-700 hover:bg-white/20 hover:border-white/30 hover:scale-105 shadow-2xl after:content-none group/btn !m-0">
              <IoIosArrowForward
                size={24}
                className="group-hover/btn:translate-x-1 transition-transform duration-300"
              />
            </div>

            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    width={1920}
                    height={900}
                    className="object-cover h-full w-full"
                    priority={slide.id === 1}
                  />
                  {/* Multi-layered Premium Gradients */}
                  <div className="absolute inset-0  to-transparent pointer-events-none" />
                  <div className="absolute inset-0  to-transparent pointer-events-none w-full lg:w-3/4" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ── Desktop: Text overlay on hero ── */}
          <div className="hidden lg:flex absolute inset-0 z-20 items-center pointer-events-none">
            <div className="relative px-20 max-w-2xl">
              <p className="hero-text-line text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 opacity-0 shadow-sm flex items-center gap-4">
                <span className="w-8 h-px bg-blue-500" />
                New Season · 2026
              </p>
              <h1 className="hero-text-line hero-display text-white text-6xl xl:text-7xl mb-6 opacity-0 shadow-2xl leading-[1.1]">
                Believers
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                  Premium Collection
                </span>
              </h1>
              <p className="hero-text-line text-white/70 text-lg mb-12 leading-relaxed opacity-0 max-w-lg font-medium drop-shadow-md">
                Crafted with precision for the modern lifestyle. Experience
                unmatched comfort and timeless style.
              </p>
              <Link
                href="/products"
                className="hero-cta-btn btn-glow pointer-events-auto inline-flex items-center gap-4 bg-white text-[#0B1221] px-10 py-5 rounded-[2rem] font-black text-[11px] opacity-0 transition-transform hover:scale-105 shadow-[0_10px_40px_rgba(255,255,255,0.2)] uppercase tracking-[0.3em] group/shop"
              >
                Shop Now{" "}
                <ArrowRight
                  size={16}
                  className="group-hover/shop:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroBanner;

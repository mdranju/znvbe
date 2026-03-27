"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// All GSAP logic is guarded by matchMedia (≥1024px) and prefers-reduced-motion
export function DesktopAnimations() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      (context) => {
        // ── Hero text entrance ──────────────────────────────────
        gsap.from(".hero-text-line", {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.18,
          ease: "power3.out",
          delay: 0.3,
        });
        gsap.from(".hero-cta-btn", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 1.0,
        });

        // ── Section heading reveals ─────────────────────────────
        gsap.utils.toArray<HTMLElement>(".section-reveal").forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          });
        });

        // ── Product card stagger on scroll ──────────────────────
        gsap.utils
          .toArray<HTMLElement>(".product-grid-desktop")
          .forEach((grid) => {
            const cards = grid.querySelectorAll<HTMLElement>(
              ".product-card-desktop",
            );
            gsap.from(cards, {
              scrollTrigger: {
                trigger: grid,
                start: "top 80%",
                toggleActions: "play none none none",
              },
              y: 40,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power2.out",
            });
          });

        // ── Category grid stagger ──────────────────────────────
        gsap.from(".category-item-desktop", {
          scrollTrigger: {
            trigger: ".category-grid-desktop",
            start: "top 80%",
          },
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
        });

        // ── Stats counter ──────────────────────────────────────
        const statEls = gsap.utils.toArray<HTMLElement>(".stat-counter");
        statEls.forEach((el) => {
          const target = parseInt(el.dataset.target ?? "0", 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate() {
              el.textContent =
                Math.round(obj.val).toLocaleString() +
                (el.dataset.suffix ?? "");
            },
          });
        });

        // ── Stats section reveal ────────────────────────────────
        gsap.from(".stats-section-desktop", {
          scrollTrigger: {
            trigger: ".stats-section-desktop",
            start: "top 85%",
          },
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: "power2.out",
        });

        // ── CTA banner reveal ──────────────────────────────────
        gsap.from(".cta-banner-desktop", {
          scrollTrigger: {
            trigger: ".cta-banner-desktop",
            start: "top 85%",
          },
          opacity: 0,
          scale: 0.97,
          duration: 0.8,
          ease: "power2.out",
        });

        // No need to return context.revert() here; mm.revert() handles it
      },
    );

    return () => mm.revert();
  }, []);

  return null; // Pure side-effect component — no DOM output
}

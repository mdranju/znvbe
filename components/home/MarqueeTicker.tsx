const MARQUEE_ITEMS = [
  "New Arrivals",
  "Premium Quality",
  "Free Delivery",
  "Islamic Lifestyle",
  "Eid Collection",
  "Authentic Designs",
  "Trusted by 10,000+",
  "Bangladesh's Finest",
  "New Arrivals",
  "Premium Quality",
  "Free Delivery",
  "Islamic Lifestyle",
  "Eid Collection",
  "Authentic Designs",
  "Trusted by 10,000+",
  "Bangladesh's Finest",
];

function MarqueeTicker() {
  return (
    <>
      {/* ── Marquee Ticker (Desktop Only) ──────────────────── */}
      <div className="hidden lg:block overflow-hidden border-y border-gray-100 bg-[#0B1221] py-5 select-none">
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 px-8 text-sm font-bold text-white/70 tracking-widest uppercase whitespace-nowrap"
            >
              {item}
              <span className="text-blue-500 opacity-60">·</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default MarqueeTicker;

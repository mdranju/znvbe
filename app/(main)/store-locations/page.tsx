import { BackButton } from "@/components/common/BackButton";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";

const STORES = [
  {
    name: "ZNVBE - London Soho",
    address: "24 Carnaby St, Soho, London W1F 7DB, UK",
    phone: "+44 20 7123 4567",
    hours: "Mon–Sat: 10AM–8PM, Sun: 12PM–6PM",
    maps: "https://maps.google.com",
  },
  {
    name: "ZNVBE - New York Manhattan",
    address: "452 Broadway, New York, NY 10013, USA",
    phone: "+1 212-555-0198",
    hours: "Mon–Sat: 10AM–9PM, Sun: 11AM–7PM",
    maps: "https://maps.google.com",
  },
  {
    name: "ZNVBE - Dubai Mall",
    address: "Level 1, The Dubai Mall, Downtown Dubai, UAE",
    phone: "+971 4 362 7500",
    hours: "Daily: 10AM–12AM",
    maps: "https://maps.google.com",
  },
];

export default function StoreLocationsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]/50 pb-20 lg:pb-32">
      {/* 1. Showroom Discovery Hero */}
      <div className="relative h-[40vh] lg:h-[50vh] flex items-center justify-center overflow-hidden bg-[#0B1221] mb-12 lg:mb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />

        <div className="relative z-10 text-center px-6">
          <p className="text-blue-400 text-[10px] font-black tracking-[0.6em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Physical Presence
          </p>
          <h1 className="hero-display text-4xl lg:text-7xl tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 uppercase">
            Our Showrooms.
          </h1>
          <div className="flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic leading-none">
              Global Network Registry Active
            </span>
            <div className="h-6 w-px bg-white/20" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-16">
          <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50" />
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-blue-600" />
            <p className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em]">
              Find A Sanctuary
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {STORES.map((store, idx) => {
            const initial =
              store.name.split("-")[1]?.trim().slice(0, 3).toUpperCase() ||
              "BS";
            return (
              <div
                key={store.name}
                className="group relative glass-card p-10 rounded-[3.5rem] bg-white border border-black/5 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-12"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Ghosted background initial for depth */}
                <div className="absolute -top-10 -right-10 text-[12rem] font-black text-black/[0.02] leading-none select-none pointer-events-none group-hover:text-blue-600/[0.03] transition-colors duration-700">
                  {initial}
                </div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600/5 text-blue-600 rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-2xl transition-all duration-700 shadow-sm border border-black/5">
                    <MapPin size={28} strokeWidth={1} />
                  </div>

                  <div className="space-y-4 mb-10">
                    <h2 className="hero-display text-2xl tracking-tighter text-[#0B1221] uppercase">
                      {store.name}
                    </h2>
                    <p className="text-xs font-bold text-[#0B1221]/40 leading-relaxed uppercase tracking-tight">
                      {store.address}
                    </p>
                  </div>

                  <div className="space-y-4 py-8 border-y border-black/5 mb-10">
                    <div className="flex items-center gap-3 group/link">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-blue-600 group-hover/link:bg-blue-500 group-hover/link:text-white transition-all duration-500">
                        <Phone size={14} strokeWidth={2} />
                      </div>
                      <a
                        href={`tel:${store.phone.replace(/-/g, "")}`}
                        className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest group-hover/link:text-blue-600 transition-colors"
                      >
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#0B1221]/20">
                        <Clock size={14} strokeWidth={2} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-[#0B1221]/20 uppercase tracking-widest block">
                          Available Window
                        </span>
                        <span className="text-[10px] font-black text-[#0B1221]/60 uppercase tracking-widest">
                          {store.hours}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={store.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glow flex items-center justify-center gap-3 bg-[#0B1221] text-white py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl shadow-black/10 group-hover:shadow-blue-500/10"
                  >
                    <Navigation
                      size={16}
                      strokeWidth={2}
                      className="group-hover:rotate-12 transition-transform duration-500"
                    />
                    Establish Route
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

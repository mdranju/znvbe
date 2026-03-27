import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="hidden lg:block relative bg-[#0B1221] text-white pt-32 pb-12 overflow-hidden">
      {/* 1. Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent opacity-40" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />

      {/* Ghosted Branding */}
      <div className="absolute -bottom-10 -left-10 text-[20rem] font-black text-white/[0.02] leading-none select-none pointer-events-none tracking-tighter">
        BELIEVERS.
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-20 mb-24">
          {/* Column 1: The Sanctuary (Brand) */}
          <div className="space-y-10">
            <Link href="/" className="inline-block group">
              <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#0B1221] font-black text-4xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-2xl shadow-white/10">
                B
                <div className="absolute -inset-2 bg-white/10 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-10" />
              </div>
            </Link>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] leading-relaxed max-w-[240px]">
              Premium Islamic Lifestyle. <br />
              Established Excellence in <br />
              Dhaka, Bangladesh.
            </p>
            <div className="flex gap-4 pt-4">
              {[
                { icon: Facebook, color: "hover:bg-blue-600" },
                { icon: Youtube, color: "hover:bg-red-600" },
                { icon: Instagram, color: "hover:bg-pink-600" },
                { icon: Twitter, color: "hover:bg-sky-500" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500 ${social.color} hover:scale-110 hover:-translate-y-1 hover:shadow-2xl`}
                >
                  <social.icon size={18} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: My Account */}
          <div>
            <h3 className="hero-display text-[11px] font-black mb-10 text-blue-400 uppercase tracking-[0.6em]">
              My Account
            </h3>
            <ul className="space-y-5">
              {[
                { name: "Profile", href: "/profile" },
                { name: "Track Order", href: "/track-order" },
                { name: "Affiliate Program", href: "/affiliate" },
                { name: "Complain Box", href: "/complain" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] hover:text-white hover:tracking-[0.5em] transition-all duration-500 flex items-center gap-2 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h3 className="hero-display text-[11px] font-black mb-10 text-blue-400 uppercase tracking-[0.6em]">
              Information
            </h3>
            <ul className="space-y-5">
              {[
                { name: "Our Showrooms", href: "/store-locations" },
                { name: "Refund Policy", href: "/refund" },
                { name: "About Us", href: "/about" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] hover:text-white hover:tracking-[0.5em] transition-all duration-500 flex items-center gap-2 group"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-500"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="hero-display text-[11px] font-black mb-10 text-blue-400 uppercase tracking-[0.6em]">
              Contact Us
            </h3>
            <div className="space-y-10">
              <div className="group">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] mb-4 group-hover:text-blue-400 transition-colors">
                  Phone Number
                </p>
                <p className="hero-display text-4xl tracking-tighter text-white group-hover:scale-105 transition-transform duration-700 origin-left">
                  09638090000
                </p>
              </div>

              <div className="space-y-6">
                <a
                  href="mailto:cc.believerssign@gmail.com"
                  className="flex items-center gap-4 group/link"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all duration-500">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] group-hover/link:text-white transition-colors">
                    {" "}
                    cc.believerssign@gmail.com
                  </span>
                </a>

                <div className="flex items-start gap-4 group/link">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all duration-500">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] leading-loose group-hover/link:text-white transition-colors">
                    Eastern Plaza, Hatirpool, <br />
                    Dhaka 1205, Bangladesh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Registry Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-8 h-px bg-blue-600" />
            <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.5em]">
              Secure Shopping
            </p>
          </div>
          <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">
            &copy; {new Date().getFullYear()} BELIEVERS GLOBAL. ALL RIGHTS
            RESERVED.
          </p>
          <div className="flex gap-8">
            {["Secure Payment", "Certified Quality", "Worldwide Delivery"].map(
              (tag) => (
                <span
                  key={tag}
                  className="text-[8px] font-black text-white/50 uppercase tracking-[0.3em]"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

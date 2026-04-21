import { BackButton } from "@/components/common/BackButton";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 to-[#0B1221] opacity-80" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-60" />

        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <p className="text-emerald-400 text-[10px] sm:text-xs font-black tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Legal
          </p>
          <h1 className="hero-display text-4xl md:text-6xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Privacy Policy.
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-xl font-medium text-[#0B1221] leading-relaxed mb-10 pb-10 border-b border-gray-100">
              At ZNVBE, we respect your privacy and are committed to
              protecting your personal data. This privacy policy explains how we
              collect, use, and safeguard your information when you visit our
              website.
            </p>

            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    01
                  </span>
                  <h2 className="text-xl font-bold text-[#0B1221] m-0">
                    Information We Collect
                  </h2>
                </div>
                <p className="text-base leading-loose">
                  We collect information you provide directly to us, such as
                  your name, email address, phone number, shipping address, and
                  payment information when you place an order or create an
                  account.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    02
                  </span>
                  <h2 className="text-xl font-bold text-[#0B1221] m-0">
                    How We Use Your Information
                  </h2>
                </div>
                <ul className="list-none pl-0 space-y-4 text-base">
                  {[
                    "To process and fulfill your orders.",
                    "To communicate with you about your orders and our services.",
                    "To improve our website and customer experience.",
                    "To send you promotional offers (with your consent).",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    03
                  </span>
                  <h2 className="text-xl font-bold text-[#0B1221] m-0">
                    Information Sharing
                  </h2>
                </div>
                <p className="text-base leading-loose">
                  We do not sell or rent your personal information to third
                  parties. We may share your data with trusted partners (e.g.,
                  delivery services) only as necessary to fulfill your orders.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    04
                  </span>
                  <h2 className="text-xl font-bold text-[#0B1221] m-0">
                    Data Security
                  </h2>
                </div>
                <p className="text-base leading-loose">
                  We implement industry-standard security measures to protect
                  your personal information. However, no data transmission over
                  the internet can be guaranteed 100% secure.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                    05
                  </span>
                  <h2 className="text-xl font-bold text-[#0B1221] m-0">
                    Contact & Rights
                  </h2>
                </div>
                <p className="text-base leading-loose">
                  You have the right to access, correct, or delete your personal
                  data. If you have any questions, please contact us at{" "}
                  <a
                    href="mailto:contact@znvbe.com"
                    className="text-blue-600 hover:text-blue-700 font-bold no-underline"
                  >
                    contact@znvbe.com
                  </a>{" "}
                  or call us at{" "}
                  <a
                    href="tel:09638090000"
                    className="text-blue-600 hover:text-blue-700 font-bold no-underline"
                  >
                    09638-090000
                  </a>
                  .
                </p>
              </section>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Version 1.0
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Last updated: March 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

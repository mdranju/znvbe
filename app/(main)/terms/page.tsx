import { BackButton } from "@/components/common/BackButton";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-[#0B1221] opacity-80" />

        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <p className="text-purple-400 text-[10px] sm:text-xs font-black tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Legal
          </p>
          <h1 className="hero-display text-4xl md:text-6xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Terms & Conditions.
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="text-xl font-medium text-[#0B1221] leading-relaxed mb-12 pb-10 border-b border-gray-100">
              Welcome to ZNVBE. These terms and conditions outline the
              rules and regulations for the use of our website. By accessing
              this website, we assume you accept these terms.
            </p>

            <div className="grid gap-12 text-base leading-loose">
              {[
                {
                  title: "1. Acceptance of Terms",
                  content:
                    "Do not continue to use ZNVBE if you do not agree to take all of the terms and conditions stated on this page.",
                },
                {
                  title: "2. Privacy Policy",
                  content:
                    "Please review our Privacy Policy, which also governs your visit to our website, to understand our practices.",
                },
                {
                  title: "3. Products and Pricing",
                  content:
                    "All products listed on the website, their descriptions, and their prices are subject to change. We reserve the right to modify, suspend, or discontinue the sale of any product at any time without notice.",
                },
                {
                  title: "4. Orders and Payment",
                  content:
                    "We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order.",
                },
                {
                  title: "5. Shipping and Delivery",
                  content:
                    "Shipping costs and delivery times vary depending on your location. We are not responsible for any delays caused by the shipping carrier.",
                },
                {
                  title: "6. Returns and Refunds",
                  content:
                    "Please refer to our Refund and Returned policy for detailed information on how to return products and request refunds.",
                },
                {
                  title: "7. Intellectual Property",
                  content:
                    "All content included on this site, such as text, graphics, logos, images, and software, is the property of ZNVBE or its content suppliers and protected by international copyright laws.",
                },
              ].map((section, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -inset-x-4 -inset-y-4 bg-gray-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  <h2 className="text-xl font-bold text-[#0B1221] mt-0 mb-3 group-hover:text-purple-600 transition-colors">
                    {section.title}
                  </h2>
                  <p className="m-0 text-gray-600">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 flex justify-center">
              <span className="text-[10px] bg-purple-50 text-purple-600 px-4 py-2 rounded-full font-bold uppercase tracking-widest">
                Effective Date: March 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

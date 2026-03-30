import { BackButton } from "@/components/common/BackButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Premium Hero Banner */}
      <div className="relative h-[40vh] bg-[#0B1221] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-900/40 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-8 left-8 z-20">
          <BackButton className="bg-white/10 text-white backdrop-blur-md border-white/10 hover:bg-white/20" />
        </div>

        <div className="relative z-10 text-center px-6 mt-12">
          <p className="text-blue-400 text-[10px] sm:text-xs font-black tracking-[0.5em] md:tracking-[0.8em] uppercase mb-4 md:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            Discover
          </p>
          <h1 className="hero-display text-4xl md:text-6xl text-white uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            About Avlora Wear.
          </h1>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24 -mt-12 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-black/5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="prose prose-lg sm:prose-xl max-w-none text-gray-600">
            <p className="text-lg sm:text-2xl font-medium text-[#0B1221] leading-relaxed mb-10">
              Avlora Wear is a premier fashion brand dedicated to high-quality apparel. 
              We started our journey with a vision to provide exceptional style, modest silhouettes, 
              and premium comfort for the modern fashion enthusiast.
            </p>

            <p className="leading-loose mb-12">
              Our collection features premium Panjabis, Thobes, Shirts, T-shirts,
              Polo Shirts, and specialized attire for every season. We meticulously 
              source the finest materials and maintain a standard of craftsmanship that 
              ensures longevity, luxury, and confidence in every garment.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 my-16">
              <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100/50 hover:shadow-xl transition-shadow duration-500">
                <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mt-0 mb-4">
                  Our Mission
                </h2>
                <p className="text-sm leading-relaxed m-0 text-gray-700">
                  To inspire and empower individuals through fashion that reflects 
                  their personality and values, by offering premium quality apparel 
                  that seamlessly blends traditional elegance with contemporary design.
                </p>
              </div>
              <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100/50 hover:shadow-xl transition-shadow duration-500">
                <h2 className="text-sm font-black text-orange-600 uppercase tracking-widest mt-0 mb-4">
                  Our Vision
                </h2>
                <p className="text-sm leading-relaxed m-0 text-gray-700">
                  To become a leading global fashion destination, recognized for our 
                  unwavering commitment to quality, innovative design, and complete 
                  customer satisfaction.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#0B1221] mt-16 mb-8 uppercase tracking-tight">
              Why Choose Us?
            </h2>
            <div className="space-y-6">
              {[
                { title: "Premium Quality", desc: "We use only the finest materials and ensure rigorous quality control." },
                { title: "Exclusive Designs", desc: "Our products feature unique and modern designs that stand out." },
                { title: "Customer Satisfaction", desc: "We prioritize our customers and offer a seamless shopping experience." },
                { title: "Ethical Practices", desc: "We are committed to ethical sourcing and manufacturing processes." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 group-hover:scale-150 transition-transform" />
                  <div>
                    <h3 className="text-base font-bold text-[#0B1221] m-0 mb-1">{item.title}</h3>
                    <p className="text-sm m-0 text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

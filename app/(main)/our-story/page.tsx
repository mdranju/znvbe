import { BackButton } from "@/components/common/BackButton";
import { Sparkles, ShieldCheck, Zap, Heart, Star, Globe } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Our Story | ZNVBE",
  description: "Discover the meaning behind ZNVBE, our vision, philosophy, and commitment to premium fashion excellence.",
};

export default function OurStoryPage() {
  const pillars = [
    {
      icon: <Sparkles className="w-6 h-6 text-blue-500" />,
      title: "Distinctive Identity",
      desc: "The name ZNVBE is unique, memorable, and instantly evokes a sense of timeless elegance and brilliance.",
      bg: "bg-blue-50/50",
      border: "border-blue-100/50"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Fashion-Forward",
      desc: "Every collection is meticulously crafted with modern trends and timeless style in mind for the modern individual.",
      bg: "bg-amber-50/50",
      border: "border-amber-100/50"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Quality & Craftsmanship",
      desc: "Premium materials, rigorous attention to detail, and luxurious finishes define every garment we create.",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100/50"
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      title: "Empowerment Through Style",
      desc: "Wearing ZNVBE is a statement—it tells the world you value self-expression, refinement, and confidence.",
      bg: "bg-rose-50/50",
      border: "border-rose-100/50"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] selection:bg-blue-100 selection:text-blue-900">
      {/* ── Premium Hero Section ─────────────────────────────────── */}
      <section className="relative h-[60vh] lg:h-[75vh] flex flex-col items-center justify-center overflow-hidden bg-[#0B1221]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        </div>

        <div className="absolute top-8 left-8 z-30">
          <BackButton className="bg-white/5 text-white backdrop-blur-xl border-white/10 hover:bg-white/10 rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-blue-400 text-[10px] sm:text-xs font-black tracking-[0.8em] uppercase mb-8 animate-in fade-in slide-in-from-top-8 duration-1000">
            Make Your Mark
          </p>
          <h1 className="hero-display text-5xl md:text-8xl lg:text-9xl text-white uppercase tracking-tighter leading-[0.85] mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            Our <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200">Story.</span>
          </h1>
          <div className="flex items-center justify-center gap-4 animate-in fade-in zoom-in duration-1000 delay-700">
            <div className="w-12 h-px bg-white/20" />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">Brilliance in Every Stitch</span>
            <div className="w-12 h-px bg-white/20" />
          </div>
        </div>

        {/* Floating Abstract Element */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" />
      </section>

      {/* ── Brand Narrative ─────────────────────────────────────── */}
      <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-24 pb-32">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Main Story Content */}
          <div className="lg:col-span-8 space-y-20">
            <div className="bg-white rounded-[3rem] p-8 md:p-16 lg:p-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-black/5">
              
              {/* Meaning Section */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Brand Journey</h2>
                  <p className="text-2xl md:text-4xl text-[#0B1221] font-black tracking-tight leading-tight">
                    ZNVBE &ndash; Make Your Mark
                  </p>
                </div>
                
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-[#0B1221] uppercase tracking-tighter">The Vision of ZNVBE</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    ZNVBE is more than just a name&mdash;it is a vision, a statement, and a lifestyle. Inspired by the desire for bold individuality, ZNVBE symbolizes new beginnings and the courage to define your own path. Our philosophy is rooted in the belief that everyone has a unique story to tell and a distinctive mark to leave on the world.
                  </p>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    ZNVBE signifies the experience, the identity, and the statement every piece carries. It is about wearing your uniqueness, your confidence, and your style. We empower you to make your mark.
                  </p>
                </div>

                {/* Philosophy Feature */}
                <div className="relative mt-20 p-10 lg:p-16 bg-[#0B1221] rounded-[2.5rem] overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-50 transition-opacity group-hover:opacity-70 duration-700" />
                  <div className="relative z-10 space-y-8 text-center md:text-left">
                    <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Our Philosophy.</h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-3xl font-medium">
                      At ZNVBE, we believe fashion is more than trends&mdash;it is empowerment, self-expression, and artistry. Each garment is designed to inspire, to transform ordinary moments into extraordinary ones. From the sleek lines of our casual essentials to the bold statements of our premium collections, ZNVBE blends timeless elegance with contemporary edge.
                    </p>
                    <p className="text-white/40 text-base leading-relaxed max-w-2xl font-medium">
                      We create for those who dare to stand out, who value quality, and who embrace the confidence that comes with wearing something extraordinary. ZNVBE is not just fashion&mdash;it is a lifestyle, a symbol of prestige, sophistication, and individuality.
                    </p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 text-[10rem] font-black text-white/[0.03] leading-none select-none pointer-events-none tracking-tighter uppercase">
                    ZNVBE
                  </div>
                </div>
              </div>

              {/* Pillars Grid */}
              <div className="mt-32 space-y-16">
                <div className="text-center md:text-left space-y-4">
                  <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Premium Standards</h2>
                  <p className="text-3xl font-black text-[#0B1221] tracking-tighter uppercase">Why ZNVBE is Premium</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {pillars.map((pillar, idx) => (
                    <div 
                      key={pillar.title} 
                      className={`p-10 rounded-[2.5rem] border ${pillar.bg} ${pillar.border} hover:shadow-2xl hover:shadow-black/[0.02] transition-all duration-700 group hover:-translate-y-2`}
                    >
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-500">
                        {pillar.icon}
                      </div>
                      <h3 className="text-xl font-black text-[#0B1221] mb-4 tracking-tight uppercase leading-none">{pillar.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed font-medium">{pillar.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Promise Banner */}
              <div className="mt-32 py-20 px-10 text-center border-t border-black/5">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-blue-500/20">
                   <Star size={32} fill="currentColor" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-[#0B1221] tracking-tighter uppercase leading-[0.9] mb-8">Brand Promise.</h2>
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
                    ZNVBE promises style that elevates, quality that lasts, and <span className="text-blue-600">confidence that shines</span>. It is a brand designed to make people feel proud, stylish, and unstoppable every day.
                  </p>
                  <p className="text-sm text-gray-400 font-black uppercase tracking-[0.3em]">
                    ZNVBE is the dawn of a new era in fashion&mdash;bright, elegant, and unforgettable.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              {/* Visual Card 1 */}
              <div className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image 
                  src="https://picsum.photos/seed/story1/800/1000" 
                  alt="ZNVBE Evolution" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221]/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-2">The Vibe</p>
                  <h3 className="text-white text-xl font-black tracking-tight uppercase">Infinite Elegance.</h3>
                </div>
              </div>

              {/* Stats/Quick Facts */}
              <div className="bg-white rounded-[2.5rem] p-10 border border-black/5 shadow-xl shadow-black/[0.02]">
                <h3 className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-[0.4em] mb-8">Quick Facts</h3>
                <div className="space-y-8">
                   {[
                     { label: "Established", value: "2026" },
                     { label: "HQ Location", value: "Dhaka, BD" },
                     { label: "Focus", value: "Premium Luxury" },
                     { label: "Delivery", value: "Worldwide" },
                   ].map((fact) => (
                     <div key={fact.label} className="flex justify-between items-center group">
                        <span className="text-[10px] font-black text-[#0B1221]/40 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{fact.label}</span>
                        <span className="text-sm font-black text-[#0B1221]">{fact.value}</span>
                     </div>
                   ))}
                </div>
              </div>

              {/* Visual Card 2 */}
              <div className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <Image 
                  src="https://picsum.photos/seed/story2/800/1000" 
                  alt="ZNVBE Craft" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221]/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-amber-400 text-[9px] font-black uppercase tracking-widest mb-2">The Promise</p>
                  <h3 className="text-white text-xl font-black tracking-tight uppercase">Premium Quality.</h3>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

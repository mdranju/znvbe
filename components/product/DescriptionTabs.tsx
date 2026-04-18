import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { SITE_CONFIG } from "@/src/config/site";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";

function DescriptionTabs({
  product,
  activeTab,
  setActiveTab,
}: {
  product: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="border-t border-gray-100 py-12 lg:py-24">
      <div className="flex justify-center gap-12 mb-16 relative">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "description" ? "text-blue-600 scale-105" : "text-gray-400 hover:text-gray-900"}`}
        >
          Description
          {activeTab === "description" && (
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("additional")}
          className={`pb-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === "additional" ? "text-blue-600 scale-105" : "text-gray-400 hover:text-gray-900"}`}
        >
          Information
          {activeTab === "additional" && (
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-blue-600 rounded-full"></div>
          )}
        </button>
      </div>

      {activeTab === "description" && (
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
                  Our Collection
                </p>
                <h2 className="text-2xl font-black text-gray-900 leading-none mb-6">
                  {product.name}
                </h2>
                <RichTextRenderer
                  content={
                    product.description ||
                    "✨ This piece blends classic tradition with a modern, refined finish, making it perfect for both festive and formal occasions. Crafted with the modern believer in mind."
                  }
                  className="prose-p:font-medium prose-p:leading-loose prose-p:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1221] mb-2">
                    Authentic
                  </h4>
                  <p className="text-sm font-bold text-gray-400">
                    Original product from {SITE_CONFIG.name}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1221] mb-2">
                    Shipping
                  </h4>
                  <p className="text-sm font-bold text-gray-400">
                    Worldwide tracking available
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-square bg-gray-50 rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-500/5 group">
              <OptimizedImage
                src={product.image}
                alt={product.name}
                fill
                context="detail"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1221]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-10 flex items-center justify-center">
                <span className="px-6 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em]">
                  Premium Fabric
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "additional" && (
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 p-10 rounded-[3rem] bg-gray-50/50 border border-gray-100">
            {product.details?.map((detail: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between py-4 border-b border-gray-200/50 last:border-0"
              >
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {detail.name}
                </span>
                <span className="text-xs font-bold text-[#0B1221] uppercase">
                  {detail.value}
                </span>
              </div>
            ))}
            {(!product.details || product.details.length === 0) && (
              <p className="col-span-full text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest py-10">
                No detailed specifications available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DescriptionTabs;

import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] group flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] border border-gray-100 hover:border-blue-100/50">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-[1/1] block overflow-hidden"
      >
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.badge}
          </div>
        )}

        {/* Primary image — fades out on hover */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
      <div className="p-4 flex flex-col flex-grow bg-white">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-snug"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center gap-2 mb-4">
          <span className="text-base font-bold text-gray-900">৳{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ৳{product.originalPrice}
            </span>
          )}
        </div>
        <Link href={`/product/${product.slug}`} className="w-full block text-center bg-[#0B1221] text-white text-xs font-bold py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 cursor-pointer uppercase tracking-widest shadow-lg shadow-black/5 hover:shadow-blue-500/25">
          View Details
        </Link>
      </div>
    </div>
  );
}

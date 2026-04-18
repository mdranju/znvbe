import { BackButton } from "@/components/common/BackButton";
import { ProductCard } from "@/components/product/ProductCard";
import { productApi, categoryApi, extractData } from "@/src/services/api";
import { resolveImageUrl } from "@/src/utils/image";
import Image from "next/image";
import Link from "next/link";
import { CategorySidebar } from "@/components/layout/CategorySidebar";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ subcategory?: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const resolvedSearchParams = await searchParams;
  const { subcategory: subcategorySlug } = resolvedSearchParams;

  // Fetch products for this category using the brand new categorySlug filter
  const productsResponse = await productApi.getAll({
    categorySlug: slug,
    subcategorySlug: subcategorySlug,
  });
  const categoryProducts = extractData<any[]>(productsResponse);

  // Fetch all categories for the sidebar
  const categoriesResponse = await categoryApi.getAll();
  const allCategories = extractData<any[]>(categoriesResponse);

  // Find current category name
  const currentCategory = allCategories.find((c) => c.slug === slug);
  const categoryName = currentCategory?.name || slug.replace("-", " ");

  return (
    <div className="min-h-screen bg-[#f8fafc]/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-12 py-10">
        <BackButton className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0B1221]/40 hover:text-[#0B1221] transition-all hover:bg-gray-50/50 mb-8" />

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-12 h-fit lg:sticky lg:top-32 hidden lg:block">
            <CategorySidebar
              categories={allCategories}
              currentSlug={slug}
              currentSubcategory={subcategorySlug}
            />

            {/* Recommended Products (Mock for now or fetch featured) */}
            <div className="pt-12 border-t border-black/5 ">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0B1221]/20 mb-8">
                Recommended
              </h3>
              <div className="space-y-6">
                {categoryProducts.slice(0, 3).map((p, i) => (
                  <Link
                    key={p._id}
                    href={`/product/${p.slug}`}
                    className="flex gap-4 group"
                  >
                    <div className="w-16 h-16 relative bg-gray-50 rounded-2xl overflow-hidden border border-black/5 shrink-0">
                      <Image
                        src={
                          resolveImageUrl(p.images?.[0]) || "/placeholder.jpg"
                        }
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-black text-[#0B1221] tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight uppercase">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-black text-blue-600/40 mt-1">
                        ৳{p.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-12">
              <div>
                <p className="text-blue-600 text-[9px] font-black uppercase tracking-[0.5em] mb-2">
                  Collection
                </p>
                <h1 className="hero-display text-4xl lg:text-5xl tracking-tighter text-[#0B1221] uppercase">
                  {categoryName}.
                </h1>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0B1221]/30">
                  {categoryProducts.length} Items
                </p>
              </div>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {categoryProducts.map((product, idx) => (
                  <div
                    key={product._id}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white rounded-[3rem] border border-black/5 shadow-2xl shadow-black/5">
                <h3 className="hero-display text-2xl text-[#0B1221]/30 uppercase tracking-widest">
                  No products found in this category
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

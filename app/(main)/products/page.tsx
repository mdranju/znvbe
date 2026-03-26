"use client";

import { use } from "react";
import { BackButton } from "@/components/common/BackButton";
import { products, categories } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { SearchX } from "lucide-react";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const category = resolvedSearchParams.category?.toLowerCase() || "";
  const search = resolvedSearchParams.search?.toLowerCase() || "";

  // Filter products locally from dummy data
  let filteredProducts = products;

  if (category) {
    // Basic category matching, in real app, products would have a category field
    // For our data, we map based on what's available or just return all if it's "all".
    filteredProducts = filteredProducts.filter((p) =>
      p.slug.includes(category),
    );
  }

  if (search) {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(search),
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BackButton className="mb-4" />
      <div className="flex flex-col gap-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {search
            ? `Search Results for "${search}"`
            : category
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products`
              : "All Products"}
        </h1>
        <p className="text-gray-500">
          Showing {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 w-full">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <SearchX size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">No products found</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn&apos;t find any products matching your current filters.
            Try adjusting your search term or category.
          </p>
          <Link
            href="/products"
            className="px-6 py-2 bg-black text-white rounded font-medium hover:bg-gray-800 transition-colors"
          >
            Clear All Filters
          </Link>
        </div>
      )}
    </div>
  );
}

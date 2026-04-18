import { Metadata } from "next";
import { SITE_CONFIG } from "@/src/config/site";
import { productApi, extractData } from "@/src/services/api";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import { resolveImageUrl } from "@/src/utils/image";

type Props = {
  params: Promise<{ id: string }>;
};

async function getProductData(id: string) {
  try {
    const response = await productApi.getById(id);
    return extractData<any>(response);
  } catch (error) {
    return null;
  }
}

async function getRelatedProducts(id: string, categoryId: string) {
  try {
    const response = await productApi.getRelated(id, categoryId);
    return extractData<any[]>(response);
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.id);
  
  if (!product) return { title: `Product Not Found | ${SITE_CONFIG.name}` };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.baseUrl;
  const productUrl = `${siteUrl}/product/${product.slug}`;
  
  const imageUrl = resolveImageUrl(product.images?.[0]);

  return {
    title: `${product.name} | ${SITE_CONFIG.name}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: productUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product._id || product.id, 
    product.category?._id || product.category
  );

  return <ProductDetailClient product={product} products={relatedProducts} />;
}

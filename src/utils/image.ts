/**
 * Centralized image utility for resolving, normalizing, and optimizing product image URLs.
 *
 * All product-related components should use these helpers instead of manually
 * constructing image URLs. This ensures consistent behavior across the entire app.
 */

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL?.replace(/=+$/, "");
/**
 * Resolves a potentially relative image path into a full, usable URL.
 * Handles all edge cases: absolute URLs, relative server paths, nulls, and empty strings.
 *
 * @param path - The image path from the API (e.g., "/uploads/products/img.jpg" or "https://...")
 * @param fallback - Fallback image path if the input is invalid
 * @returns A fully resolved URL string
 */
export const resolveImageUrl = (
  path: any,
  fallback: string = "/placeholder.jpg",
): string => {
  if (!path) return fallback;

  // Handle object structure { url, public_id }
  const pathString = typeof path === 'object' ? path.url : path;

  if (!pathString || typeof pathString !== 'string' || pathString.trim() === "") return fallback;
  if (pathString.startsWith("http://") || pathString.startsWith("https://")) return pathString;
  if (pathString.startsWith("data:")) return pathString; // base64 data URIs

  // Fix for legacy backend bug where some banner images were stored with /bannerImage/ prefix
  let normalizedPath = pathString;
  if (pathString.includes("/bannerImage/")) {
    normalizedPath = pathString.replace("/bannerImage/", "/image/");
  }

  // Server-relative path: prepend the image base URL
  return `${IMAGE_BASE_URL}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;
};

/**
 * Resolves the first image from a product's images array.
 * Handles both single-image (`product.image`) and multi-image (`product.images[]`) schemas.
 *
 * @param product - The raw product object from the API
 * @param fallback - Fallback image if no valid image is found
 * @returns A fully resolved URL string for the product's primary image
 */
export const getProductImage = (
  product: { image?: string; images?: string[] } | null | undefined,
  fallback: string = "/placeholder.jpg",
): string => {
  if (!product) return fallback;
  const raw = product.image || product.images?.[0];
  return resolveImageUrl(raw, fallback);
};

/**
 * Resolves all images from a product into full URLs.
 * Useful for product detail pages with image galleries.
 *
 * @param product - The raw product object from the API
 * @returns An array of fully resolved image URL strings
 */
export const getProductImages = (
  product: { image?: string; images?: string[] } | null | undefined,
): string[] => {
  if (!product) return ["/placeholder.jpg"];
  const imgs = product.images || (product.image ? [product.image] : []);
  if (imgs.length === 0) return ["/placeholder.jpg"];
  return imgs.map((img) => resolveImageUrl(img));
};

/**
 * Image size presets for Next.js Image component.
 * These define consistent `sizes` attributes to help the browser pick optimal
 * image resolution from Next.js's automatic srcsets.
 */
export const IMAGE_SIZES = {
  /** Search suggestions, cart thumbnails, small previews */
  thumbnail: "64px",
  /** Product cards in grids */
  card: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  /** Category banners, featured sections */
  banner: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  /** Product detail hero image */
  detail: "(max-width: 768px) 100vw, 50vw",
  /** Full-width hero/carousel banners */
  hero: "100vw",
} as const;

/**
 * Quality presets for Next.js Image component.
 * Lower quality = smaller file size = faster load.
 */
export const IMAGE_QUALITY = {
  /** Search previews, tiny thumbnails */
  low: 50,
  /** Product cards, category grids */
  medium: 75,
  /** Product detail pages, hero banners */
  high: 90,
} as const;

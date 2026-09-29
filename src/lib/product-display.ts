import type { Product } from "@/app/(storefront)/products/product.types";
export function productPrice(
  product: Pick<Product, "price" | "priceAfterDiscount">,
) {
  return product.priceAfterDiscount ?? product.price;
}
export function formatPrice(price: number, decimals = false) {
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals ? 2 : 0, maximumFractionDigits: 2 }).format(price)} EGP`;
}
export function productImageUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === "ecommerce.routemisr.com" &&
      url.pathname.startsWith("/Route-Academy-products/")
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function productImages(product: Pick<Product, "images" | "imageCover">) {
  const images = [
    ...new Set(
      product.images
        .map(productImageUrl)
        .filter((url): url is string => Boolean(url)),
    ),
  ];
  const cover = productImageUrl(product.imageCover);
  return images.length ? images : cover ? [cover] : [];
}
export function clampQuantity(value: number, stock: number) {
  if (stock <= 0) return 0;
  return Math.min(
    stock,
    Math.max(1, Number.isFinite(value) ? Math.trunc(value) : 1),
  );
}

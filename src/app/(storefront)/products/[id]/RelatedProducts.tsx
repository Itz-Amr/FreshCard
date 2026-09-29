import ProductCard from "@/components/catalog/ProductCard";
import { SectionHeading } from "@/components/shared/storefront-ui";
import { getProducts } from "../product.services";
import type { Product } from "../product.types";
import ProductCarousel from "./ProductCarousel";

export default async function RelatedProducts({
  id,
  categoryId,
}: {
  id: string;
  categoryId?: string;
}) {
  let products: Product[];
  try {
    products = (await getProducts()).data
      .filter(
        (product) => product._id !== id && product.category?._id === categoryId,
      )
      .slice(0, 10);
  } catch {
    return null;
  }
  if (!products.length) return null;
  return (
    <section className="related-products" aria-label="Related products">
      <SectionHeading accent="Products">Related</SectionHeading>
      <ProductCarousel
        items={products.map((product) => ({
          id: product._id,
          content: <ProductCard product={product} />,
        }))}
      />
    </section>
  );
}

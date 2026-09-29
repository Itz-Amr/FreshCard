import Link from "next/link";
import { getProducts } from "@/app/(storefront)/products/product.services";
import type { ProductsResponse } from "@/app/(storefront)/products/product.types";
import ProductCard from "@/components/catalog/ProductCard";
import { productsHref } from "../product.navigation";
import type { ProductQuery } from "../product.query";
export default async function ProductsGrid({
  page,
  brand,
  category,
  subcategory,
  home = false,
  showCount = false,
  query,
  pageHref,
}: {
  page: number;
  brand?: string;
  category?: string;
  subcategory?: string;
  home?: boolean;
  showCount?: boolean;
  query?: ProductQuery;
  pageHref?: (page: number) => string;
}) {
  const href = (number: number) =>
    pageHref
      ? pageHref(number)
      : productsHref({ page: number, brand, category, subcategory, home });
  let result: ProductsResponse;
  try {
    result = await getProducts(page, brand ?? query?.brand, category, {
      ...query,
      subcategory: subcategory ?? query?.subcategory,
    });
  } catch {
    return (
      <div className="catalog-message" role="alert">
        <h3>Products are temporarily unavailable</h3>
        <p>Please try again in a moment.</p>
        <a href={href(page)} className="button">
          Try again
        </a>
      </div>
    );
  }
  if (!result.data.length)
    return (
      <>
        {showCount && (
          <p className="filtered-products-count">
            Showing {result.results} products
          </p>
        )}
        <div className="catalog-message">
          <h3>No products found</h3>
          <p>Check back soon for new arrivals.</p>
          {page > 1 && <Link href={href(1)}>Back to products</Link>}
        </div>
      </>
    );
  return (
    <>
      {showCount && (
        <p className="filtered-products-count">
          Showing {result.results} products
        </p>
      )}
      <div className="product-grid">
        {result.data.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {result.metadata.numberOfPages > 1 && (
        <nav className="product-pagination" aria-label="Product pages">
          {Array.from(
            { length: result.metadata.numberOfPages },
            (_, i) => i + 1,
          ).map((number) => (
            <Link
              href={href(number)}
              key={number}
              aria-current={
                number === result.metadata.currentPage ? "page" : undefined
              }
            >
              {number}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}

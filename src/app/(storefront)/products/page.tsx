import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageContainer } from "@/components/shared/storefront-ui";
import FilteredProducts from "./components/FilteredProducts";
import ProductsGrid from "./components/ProductsGrid";
import ProductsSkeleton from "./components/ProductsSkeleton";
import "./filtered-products.css";

export const metadata: Metadata = { title: "Products | FreshCart" };
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string | string[];
    brand?: string | string[];
    category?: string | string[];
    subcategory?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const page = typeof query.page === "string" ? Number(query.page) || 1 : 1;
  const brand = typeof query.brand === "string" ? query.brand : undefined;
  const subcategory =
    typeof query.subcategory === "string" ? query.subcategory : undefined;
  const invalidSubcategory =
    query.subcategory !== undefined &&
    (!subcategory || !/^[a-f\d]{24}$/i.test(subcategory));
  const category =
    typeof query.category === "string" ? query.category : undefined;
  const invalidCategory =
    query.category !== undefined &&
    (!category || !/^[a-f\d]{24}$/i.test(category));
  const invalidBrand =
    query.brand !== undefined && (!brand || !/^[a-f\d]{24}$/i.test(brand));
  if (
    (brand || category || subcategory) &&
    !invalidBrand &&
    !invalidCategory &&
    !invalidSubcategory
  )
    return (
      <FilteredProducts
        brandId={brand}
        categoryId={category}
        subcategoryId={subcategory}
        page={page}
      />
    );
  return (
    <section className="products-section" id="products">
      <PageContainer>
        <h1 className="section-heading">
          All <span>Products</span>
        </h1>
        {invalidBrand || invalidCategory || invalidSubcategory ? (
          <div className="catalog-message" role="alert">
            <h2>
              Invalid{" "}
              {invalidSubcategory
                ? "subcategory"
                : invalidCategory
                  ? "category"
                  : "brand"}{" "}
              filter
            </h2>
            <Link href="/products">Browse all products</Link>
          </div>
        ) : (
          <Suspense
            key={`${page}:${brand ?? "all"}`}
            fallback={<ProductsSkeleton />}
          >
            <ProductsGrid page={page} brand={brand} />
          </Suspense>
        )}
      </PageContainer>
    </section>
  );
}

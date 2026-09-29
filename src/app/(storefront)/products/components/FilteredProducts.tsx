import Link from "next/link";
import { Suspense } from "react";
import CategoryImage from "@/components/catalog/CategoryImage";
import { PageContainer } from "@/components/shared/storefront-ui";
import { getBrands } from "../../brands/brands.services";
import BrandImage from "../../brands/components/BrandImage";
import {
  getAllSubcategories,
  getCategories,
} from "../../categories/categories.services";
import { productsHref } from "../product.navigation";
import ActiveFilters from "./ActiveFilters";
import ProductsGrid from "./ProductsGrid";
import ProductsSkeleton from "./ProductsSkeleton";

export default async function FilteredProducts({
  brandId,
  categoryId,
  subcategoryId,
  page,
}: {
  brandId?: string;
  categoryId?: string;
  subcategoryId?: string;
  page: number;
}) {
  const requested = [
    ...(subcategoryId
      ? [
          {
            kind: "subcategory" as const,
            id: subcategoryId,
            title: "Subcategory",
            group: "Categories",
            href: categoryId
              ? `/categories?category=${categoryId}#subcategories`
              : "/categories",
          },
        ]
      : []),
    ...(categoryId
      ? [
          {
            kind: "category" as const,
            id: categoryId,
            title: "Category",
            group: "Categories",
            href: "/categories",
          },
        ]
      : []),
    ...(brandId
      ? [
          {
            kind: "brand" as const,
            id: brandId,
            title: "Brand",
            group: "Brands",
            href: "/brands",
          },
        ]
      : []),
  ];
  let filters: ((typeof requested)[number] & {
    record: { name: string; image?: string; category?: string } | undefined;
  })[];
  try {
    filters = await Promise.all(
      requested.map(async (filter) => ({
        ...filter,
        record: (
          await (filter.kind === "subcategory"
            ? getAllSubcategories()
            : filter.kind === "category"
              ? getCategories()
              : getBrands())
        ).find((item) => item._id === filter.id),
      })),
    );
  } catch {
    return (
      <PageContainer className="catalog-message">
        <h1>
          {subcategoryId ? "Subcategory" : categoryId ? "Category" : "Brand"} is
          temporarily unavailable
        </h1>
        <p>Please try again in a moment.</p>
        <a
          className="button"
          href={productsHref({
            brand: brandId,
            category: categoryId,
            subcategory: subcategoryId,
            page,
          })}
        >
          Try again
        </a>
      </PageContainer>
    );
  }
  const missing = filters.find((filter) => !filter.record);
  if (missing)
    return (
      <PageContainer className="catalog-message">
        <h1>{missing.title} not found</h1>
        <Link href={missing.href}>Browse {missing.group.toLowerCase()}</Link>
      </PageContainer>
    );
  const identity = filters[0];
  const record = identity?.record;
  if (!record) return null;
  const parent = filters.find((filter) => filter.kind === "category")?.record;
  if (subcategoryId && categoryId && record.category !== categoryId)
    return (
      <PageContainer className="catalog-message">
        <h1>Subcategory does not belong to this category</h1>
        <Link href={`/categories?category=${categoryId}#subcategories`}>
          Browse this category's subcategories
        </Link>
      </PageContainer>
    );
  const image = record.image ?? parent?.image;
  return (
    <section className="filtered-products-page">
      <div className="filtered-products-hero">
        <PageContainer>
          <nav aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={subcategoryId ? "/categories" : identity.href}>
              {identity.group}
            </Link>
            <span aria-hidden="true">/</span>
            {subcategoryId && parent && (
              <>
                <Link href={identity.href}>{parent.name}</Link>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span aria-current="page">{record.name}</span>
          </nav>
          <div className="filtered-products-identity">
            {image && (
              <div className="filtered-products-logo">
                <div>
                  {identity.kind !== "brand" ? (
                    <CategoryImage
                      src={image}
                      name={parent?.name ?? record.name}
                      fill
                      sizes="40px"
                    />
                  ) : (
                    <BrandImage src={image} name={record.name} />
                  )}
                </div>
              </div>
            )}
            <div>
              <h1>{record.name}</h1>
              <p>Shop {record.name} products</p>
            </div>
          </div>
        </PageContainer>
      </div>
      <PageContainer className="filtered-products-content">
        <ActiveFilters
          filters={filters.map((filter) => ({
            id: filter.kind,
            label: filter.record?.name ?? "",
            removeHref: productsHref({
              brand: filter.kind === "brand" ? undefined : brandId,
              category: filter.kind === "category" ? undefined : categoryId,
              subcategory:
                filter.kind === "subcategory" ? undefined : subcategoryId,
            }),
          }))}
          clearHref="/products"
        />
        <Suspense
          key={`${brandId}:${categoryId}:${subcategoryId}:${page}`}
          fallback={<ProductsSkeleton />}
        >
          <ProductsGrid
            page={page}
            brand={brandId}
            category={categoryId}
            subcategory={subcategoryId}
            showCount
          />
        </Suspense>
      </PageContainer>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getBrands } from "../brands/brands.services";
import { getCategories } from "../categories/categories.services";
import ActiveFilters from "../products/components/ActiveFilters";
import ProductsGrid from "../products/components/ProductsGrid";
import ProductsSkeleton from "../products/components/ProductsSkeleton";
import SearchWorkspace from "./components/SearchWorkspace";
import {
  parseSearchParams,
  type SearchParams,
  type SearchState,
  searchHref,
} from "./search.navigation";
import "../products/filtered-products.css";
import "./search.css";
export const metadata: Metadata = { title: "Search | FreshCart" };
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { state, error } = parseSearchParams(await searchParams);
  const [categoryResult, brandResult] = await Promise.allSettled([
    getCategories(),
    getBrands(),
  ]);
  const categories =
    categoryResult.status === "fulfilled" ? categoryResult.value : null;
  const brands = brandResult.status === "fulfilled" ? brandResult.value : null;
  const filters: { id: string; label: string; removeHref: string }[] = [];
  const remove = (patch: Partial<SearchState>) =>
    searchHref({ ...state, ...patch, page: 1 });
  if (state.keyword)
    filters.push({
      id: "keyword",
      label: state.keyword,
      removeHref: remove({ keyword: undefined }),
    });
  for (const id of state.categories)
    filters.push({
      id,
      label: categories?.find((c) => c._id === id)?.name ?? "Category",
      removeHref: remove({
        categories: state.categories.filter((c) => c !== id),
      }),
    });
  if (state.brand)
    filters.push({
      id: "brand",
      label: brands?.find((b) => b._id === state.brand)?.name ?? "Brand",
      removeHref: remove({ brand: undefined }),
    });
  if (state.minPrice !== undefined)
    filters.push({
      id: "min",
      label: `Min ${state.minPrice} EGP`,
      removeHref: remove({ minPrice: undefined }),
    });
  if (state.maxPrice !== undefined)
    filters.push({
      id: "max",
      label: `Max ${state.maxPrice} EGP`,
      removeHref: remove({ maxPrice: undefined }),
    });
  if (state.sort)
    filters.push({
      id: "sort",
      label:
        state.sort === "price"
          ? "Price: Low to High"
          : state.sort === "-price"
            ? "Price: High to Low"
            : "Highest Rated",
      removeHref: remove({ sort: undefined }),
    });
  return (
    <div className="search-page">
      <SearchWorkspace
        state={state}
        categories={categories}
        brands={brands}
        activeFilters={
          filters.length ? (
            <ActiveFilters filters={filters} clearHref="/search" />
          ) : null
        }
      >
        {error ? (
          <div className="catalog-message" role="alert">
            <h2>Invalid search filters</h2>
            <p>{error}</p>
            <Link href="/search">Clear all filters</Link>
          </div>
        ) : (
          <Suspense key={searchHref(state)} fallback={<ProductsSkeleton />}>
            <ProductsGrid
              page={state.page}
              query={state}
              pageHref={(page) => searchHref({ ...state, page })}
              showCount
            />
          </Suspense>
        )}
      </SearchWorkspace>
    </div>
  );
}

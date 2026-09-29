import {
  isCatalogId,
  type ProductQuery,
  type ProductSort,
  productSorts,
} from "../products/product.query";
export type SearchState = ProductQuery & { categories: string[]; page: number };
export type SearchParams = Record<string, string | string[] | undefined>;
export function parseSearchParams(params: SearchParams): {
  state: SearchState;
  error?: string;
} {
  const single = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : undefined;
  const category = params.category;
  const categories = [
    ...new Set(
      category === undefined
        ? []
        : typeof category === "string"
          ? [category]
          : category,
    ),
  ];
  const brand = single("brand");
  const price = (key: string) =>
    single(key)?.trim() ? Number(single(key)) : undefined;
  const minPrice = price("minPrice"),
    maxPrice = price("maxPrice");
  const sort = single("sort");
  const page = Number(single("page"));
  const state: SearchState = {
    keyword: single("keyword")?.trim() || undefined,
    categories,
    brand,
    minPrice,
    maxPrice,
    sort: productSorts.includes(sort as ProductSort)
      ? (sort as ProductSort)
      : undefined,
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    limit: 12,
  };
  if (
    categories.some((id) => !isCatalogId(id)) ||
    (brand !== undefined && !isCatalogId(brand)) ||
    Array.isArray(params.brand)
  )
    return {
      state,
      error: "Please remove the invalid category or brand filter.",
    };
  if (
    [minPrice, maxPrice].some(
      (value) => value !== undefined && (!Number.isFinite(value) || value < 0),
    ) ||
    Array.isArray(params.minPrice) ||
    Array.isArray(params.maxPrice)
  )
    return { state, error: "Prices must be non-negative numbers." };
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)
    return { state, error: "Minimum price must not exceed maximum price." };
  return { state };
}
export function searchHref(state: Partial<SearchState> = {}) {
  const params = new URLSearchParams();
  if (state.keyword?.trim()) params.set("keyword", state.keyword.trim());
  for (const category of new Set(state.categories))
    params.append("category", category);
  if (state.brand) params.set("brand", state.brand);
  if (state.minPrice !== undefined)
    params.set("minPrice", String(state.minPrice));
  if (state.maxPrice !== undefined)
    params.set("maxPrice", String(state.maxPrice));
  if (state.sort) params.set("sort", state.sort);
  if (state.page && state.page > 1) params.set("page", String(state.page));
  return `/search${params.size ? `?${params}` : ""}`;
}

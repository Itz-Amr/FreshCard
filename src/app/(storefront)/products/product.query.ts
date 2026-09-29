export const productSorts = ["price", "-price", "-ratingsAverage"] as const;
export type ProductSort = (typeof productSorts)[number];
export type ProductQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  brand?: string;
  subcategory?: string;
  categories?: readonly string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
};
export const isCatalogId = (id: string) => /^[a-f\d]{24}$/i.test(id);
export function productsApiPath(query: ProductQuery = {}) {
  if (query.subcategory !== undefined && !isCatalogId(query.subcategory))
    throw new Error("Invalid subcategory");
  if (query.brand !== undefined && !isCatalogId(query.brand))
    throw new Error("Invalid brand");
  if (query.categories?.some((id) => !isCatalogId(id)))
    throw new Error("Invalid category");
  for (const price of [query.minPrice, query.maxPrice])
    if (price !== undefined && (!Number.isFinite(price) || price < 0))
      throw new Error("Invalid price");
  if (
    query.minPrice !== undefined &&
    query.maxPrice !== undefined &&
    query.minPrice > query.maxPrice
  )
    throw new Error("Invalid price range");
  if (query.sort !== undefined && !productSorts.includes(query.sort))
    throw new Error("Invalid sort");
  const page =
    Number.isSafeInteger(query.page) && (query.page ?? 0) > 0 ? query.page : 1;
  const limit =
    Number.isSafeInteger(query.limit) &&
    (query.limit ?? 0) > 0 &&
    (query.limit ?? 0) <= 100
      ? query.limit
      : 40;
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });
  if (query.brand) params.set("brand", query.brand);
  if (query.subcategory) params.set("subcategory", query.subcategory);
  for (const id of new Set(query.categories)) params.append("category[in]", id);
  if (query.keyword?.trim()) params.set("keyword", query.keyword.trim());
  if (query.minPrice !== undefined)
    params.set("price[gte]", String(query.minPrice));
  if (query.maxPrice !== undefined)
    params.set("price[lte]", String(query.maxPrice));
  if (query.sort) params.set("sort", query.sort);
  return `/products?${params.toString().replaceAll("%5B", "[").replaceAll("%5D", "]")}`;
}

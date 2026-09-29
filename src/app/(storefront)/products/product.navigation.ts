export function productsHref({
  page,
  brand,
  category,
  subcategory,
  home = false,
}: {
  page?: number;
  brand?: string;
  category?: string;
  subcategory?: string;
  home?: boolean;
} = {}) {
  const query = new URLSearchParams();
  if (page !== undefined) query.set("page", String(page));
  if (brand) query.set("brand", brand);
  if (category) query.set("category", category);
  if (subcategory) query.set("subcategory", subcategory);
  return `${home ? "/" : "/products"}${query.size ? `?${query}` : ""}${home ? "#products" : ""}`;
}

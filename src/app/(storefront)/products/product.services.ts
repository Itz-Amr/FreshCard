import "server-only";
import { cache } from "react";
import { apiUrl } from "@/lib/auth-api";
import { type ProductQuery, productsApiPath } from "./product.query";
import {
  type Product,
  type ProductsResponse,
  productSchema,
  productsResponseSchema,
} from "./product.types";
export class ProductApiError extends Error {
  constructor() {
    super("Products are temporarily unavailable.");
    this.name = "ProductApiError";
  }
}
async function requestProductData(path: string): Promise<unknown> {
  try {
    const response = await fetch(apiUrl(path), {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new ProductApiError();
    return await response.json();
  } catch {
    throw new ProductApiError();
  }
}
export const getProducts = cache(
  async (
    page = 1,
    brand?: string,
    category?: string | readonly string[],
    options: ProductQuery = {},
  ): Promise<ProductsResponse> => {
    let path: string;
    try {
      path = productsApiPath({
        ...options,
        page,
        brand,
        categories:
          category === undefined
            ? options.categories
            : typeof category === "string"
              ? [category]
              : category,
      });
    } catch {
      throw new ProductApiError();
    }
    const parsed = productsResponseSchema.safeParse(
      await requestProductData(path),
    );
    if (!parsed.success) throw new ProductApiError();
    const keyword = options.keyword?.trim().toLowerCase();
    if (keyword && parsed.data.results === 0) {
      // Keep backend filters/sort, but search titles across every matching page.
      const params = new URLSearchParams(path.split("?")[1]);
      const currentPage = Number(params.get("page"));
      const limit = Number(params.get("limit"));
      params.delete("keyword");
      params.set("limit", "100");
      const matches: Product[] = [];
      let numberOfPages = 1;
      for (let sourcePage = 1; sourcePage <= numberOfPages; sourcePage++) {
        params.set("page", String(sourcePage));
        const batch = productsResponseSchema.safeParse(
          await requestProductData(`/products?${params.toString()}`),
        );
        if (!batch.success || batch.data.metadata.currentPage !== sourcePage)
          throw new ProductApiError();
        numberOfPages = batch.data.metadata.numberOfPages;
        matches.push(
          ...batch.data.data.filter((product) =>
            product.title.toLowerCase().includes(keyword),
          ),
        );
      }
      const pages = Math.ceil(matches.length / limit);
      return {
        results: matches.length,
        metadata: {
          currentPage,
          numberOfPages: pages,
          limit,
          ...(currentPage < pages ? { nextPage: currentPage + 1 } : {}),
        },
        data: matches.slice((currentPage - 1) * limit, currentPage * limit),
      };
    }
    return parsed.data;
  },
);
export const getProduct = cache(async (id: string): Promise<Product | null> => {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  const response = await requestProductData(`/products/${id}`);
  if (response === null) return null;
  if (typeof response !== "object" || !("data" in response))
    throw new ProductApiError();
  if (response.data === null) return null;
  const parsed = productSchema.safeParse(response.data);
  if (!parsed.success) throw new ProductApiError();
  return parsed.data;
});

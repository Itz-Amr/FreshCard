import "server-only";
import { cache } from "react";
import type { z } from "zod";
import { apiUrl } from "@/lib/auth-api";
import {
  categoriesResponseSchema,
  type PaginationMetadata,
  subcategoriesResponseSchema,
} from "./categories.types";

export class CategoriesApiError extends Error {
  constructor() {
    super("Categories are temporarily unavailable.");
    this.name = "CategoriesApiError";
  }
}
async function getCollection<T extends { _id: string }>(
  endpoint: "categories" | "subcategories",
  schema: z.ZodType<{
    results: number;
    metadata: PaginationMetadata;
    data: T[];
  }>,
): Promise<T[]> {
  try {
    async function read(page: number) {
      const response = await fetch(
        apiUrl(`/${endpoint}?limit=40&page=${page}`),
        {
          next: { revalidate: 3600, tags: [endpoint] },
          redirect: "error",
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (!response.ok) throw new CategoriesApiError();
      const result = schema.parse(await response.json());
      if (result.metadata.currentPage !== page) throw new CategoriesApiError();
      return result;
    }
    const first = await read(1);
    const all = [...first.data];
    // Consume metadata, never a hardcoded dataset size or the unreliable nested endpoint.
    for (let page = 2; page <= first.metadata.numberOfPages; page++) {
      const next = await read(page);
      if (
        next.metadata.numberOfPages !== first.metadata.numberOfPages ||
        next.results !== first.results
      )
        throw new CategoriesApiError();
      all.push(...next.data);
    }
    if (
      all.length !== first.results ||
      new Set(all.map((item) => item._id)).size !== all.length
    )
      throw new CategoriesApiError();
    return all;
  } catch {
    throw new CategoriesApiError();
  }
}
export const getCategories = cache(() =>
  getCollection("categories", categoriesResponseSchema),
);
export const getAllSubcategories = cache(() =>
  getCollection("subcategories", subcategoriesResponseSchema),
);
export const getCategory = cache(
  async (idOrSlug: string) =>
    (await getCategories()).find(
      (category) => category._id === idOrSlug || category.slug === idOrSlug,
    ) ?? null,
);
export const getSubcategoriesByCategory = cache(async (categoryId: string) =>
  (await getAllSubcategories()).filter(
    (subcategory) => subcategory.category === categoryId,
  ),
);

// Curated navigation order only; category records, labels, and IDs always come from the API.
const navigationSlugs = [
  "electronics",
  "women's-fashion",
  "men's-fashion",
  "beauty-and-health",
];
export async function getNavigationCategories() {
  try {
    const categories = await getCategories();
    return navigationSlugs.flatMap((slug) => {
      const category = categories.find((item) => item.slug === slug);
      return category
        ? [{ _id: category._id, name: category.name, slug: category.slug }]
        : [];
    });
  } catch {
    return [];
  }
}

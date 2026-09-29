import "server-only";
import { cache } from "react";
import { apiUrl } from "@/lib/auth-api";
import { brandsResponseSchema } from "./brands.types";

export class BrandsApiError extends Error {
  constructor() {
    super("Brands are temporarily unavailable.");
    this.name = "BrandsApiError";
  }
}
export const getBrands = cache(async () => {
  try {
    async function read(page: number) {
      const response = await fetch(apiUrl(`/brands?limit=40&page=${page}`), {
        next: { revalidate: 3600, tags: ["brands"] },
        redirect: "error",
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new BrandsApiError();
      const result = brandsResponseSchema.parse(await response.json());
      if (result.metadata.currentPage !== page) throw new BrandsApiError();
      return result;
    }
    const first = await read(1);
    const brands = [...first.data];
    for (let page = 2; page <= first.metadata.numberOfPages; page++) {
      const next = await read(page);
      if (
        next.metadata.numberOfPages !== first.metadata.numberOfPages ||
        next.results !== first.results
      )
        throw new BrandsApiError();
      brands.push(...next.data);
    }
    if (
      brands.length !== first.results ||
      new Set(brands.map((brand) => brand._id)).size !== brands.length
    )
      throw new BrandsApiError();
    return brands;
  } catch {
    throw new BrandsApiError();
  }
});

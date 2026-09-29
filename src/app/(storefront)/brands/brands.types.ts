import { z } from "zod";
import { paginationMetadataSchema } from "../categories/categories.types";

export const brandSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export const brandsResponseSchema = z.object({
  results: z.number().int().nonnegative(),
  metadata: paginationMetadataSchema,
  data: z.array(brandSchema),
});
export type Brand = z.infer<typeof brandSchema>;
export type BrandsResponse = z.infer<typeof brandsResponseSchema>;

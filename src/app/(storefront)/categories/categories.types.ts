import { z } from "zod";

export const paginationMetadataSchema = z.object({
  currentPage: z.number().int().positive(),
  numberOfPages: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  nextPage: z.number().int().positive().optional(),
  prevPage: z.number().int().positive().optional(),
});
const id = z.string().regex(/^[a-f\d]{24}$/i);
export const categorySchema = z.object({
  _id: id,
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export const subcategorySchema = categorySchema
  .omit({ image: true })
  .extend({ category: id });
export const categoriesResponseSchema = z.object({
  results: z.number().int().nonnegative(),
  metadata: paginationMetadataSchema,
  data: z.array(categorySchema),
});
export const subcategoriesResponseSchema = z.object({
  results: z.number().int().nonnegative(),
  metadata: paginationMetadataSchema,
  data: z.array(subcategorySchema),
});
export type Category = z.infer<typeof categorySchema>;
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;
export type Subcategory = z.infer<typeof subcategorySchema>;
export type SubcategoriesResponse = z.infer<typeof subcategoriesResponseSchema>;
export type PaginationMetadata = z.infer<typeof paginationMetadataSchema>;

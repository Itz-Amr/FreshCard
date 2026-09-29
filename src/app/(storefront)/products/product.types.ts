import { z } from "zod";

const taxonomySchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string().optional(),
  image: z.string().optional(),
});
export const reviewSchema = z.object({
  _id: z.string(),
  review: z.string().optional(),
  rating: z.number().min(0).max(5),
  product: z.string().optional(),
  user: z.object({ _id: z.string(), name: z.string() }).nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export const productSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
  id: z.string().optional(),
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().default(""),
  quantity: z.number().int().nonnegative(),
  price: z.number().nonnegative(),
  priceAfterDiscount: z.number().nonnegative().optional(),
  imageCover: z.string().nullable().optional(),
  images: z.array(z.string()).default([]),
  sold: z.number().nonnegative().optional(),
  category: taxonomySchema.nullable().optional(),
  brand: taxonomySchema.nullable().optional(),
  subcategory: z
    .array(taxonomySchema.extend({ category: z.string().optional() }))
    .default([]),
  ratingsAverage: z.number().min(0).max(5),
  ratingsQuantity: z.number().int().nonnegative(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  reviews: z.array(reviewSchema).default([]),
});
export const productsResponseSchema = z.object({
  results: z.number().int().nonnegative(),
  metadata: z.object({
    currentPage: z.number().int().positive(),
    numberOfPages: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
    nextPage: z.number().int().optional(),
  }),
  data: z.array(productSchema),
});
export type Product = z.infer<typeof productSchema>;
export type ProductReview = z.infer<typeof reviewSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;

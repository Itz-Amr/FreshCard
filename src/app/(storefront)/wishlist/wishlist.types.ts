import { z } from "zod";
import { productSchema } from "../products/product.types";

export const wishlistProductIdSchema = productSchema.shape._id;
export const wishlistResponseSchema = z.object({
  status: z.literal("success"),
  count: z.number().int().nonnegative(),
  data: z.array(productSchema),
});
export const wishlistAddResponseSchema = z.object({
  status: z.literal("success"),
  message: z.string(),
  data: z.array(wishlistProductIdSchema),
});
export type WishlistSnapshot =
  | { status: "ready"; ids: string[]; count: number }
  | { status: "guest" | "unavailable" };
export type WishlistActionResult =
  | { success: true }
  | { success: false; code: "login" | "error"; message: string };

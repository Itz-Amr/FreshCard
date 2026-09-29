import { z } from "zod";
import { productSchema } from "../products/product.types";

export const cartProductSchema = productSchema.pick({
  _id: true,
  title: true,
  quantity: true,
  imageCover: true,
  category: true,
  brand: true,
});
export const cartItemSchema = z.object({
  count: z.number().int().positive(),
  price: z.number().nonnegative(),
  product: cartProductSchema,
});
export const cartDataSchema = z.object({
  products: z.array(cartItemSchema),
  totalCartPrice: z.number().nonnegative(),
});
export const cartResponseSchema = z.object({
  status: z.literal("success"),
  numOfCartItems: z.number().int().nonnegative(),
  cartId: z.string().nullable(),
  data: cartDataSchema,
});
const id = productSchema.shape._id;
export const cartCommandSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("add"),
    productId: id,
    count: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("update"),
    productId: id,
    count: z.number().int().positive(),
  }),
  z.object({ type: z.literal("remove"), productId: id }),
  z.object({ type: z.literal("clear") }),
  z.object({
    type: z.literal("coupon"),
    couponName: z.string().trim().min(1).max(100),
  }),
]);
export type CartProduct = z.infer<typeof cartProductSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CartData = z.infer<typeof cartDataSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
export type CartCommand = z.infer<typeof cartCommandSchema>;
export type CartSnapshot =
  | { status: "ready"; count: number; quantities: Record<string, number> }
  | { status: "guest" | "unavailable" };
export type CartActionResult =
  | { success: true; message: string }
  | { success: false; code: "login" | "error"; message: string };

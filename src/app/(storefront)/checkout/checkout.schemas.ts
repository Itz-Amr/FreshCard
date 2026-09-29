import { z } from "zod";
import {
  addressIdSchema,
  addressInputSchema,
} from "../profile/addresses/addresses.schemas";

export const shippingAddressSchema = addressInputSchema
  .pick({ city: true, details: true, phone: true })
  .extend({
    postalCode: z
      .string()
      .trim()
      .regex(/^[\p{L}\d -]{1,20}$/u, "Enter a valid postal code")
      .optional(),
  });
export const checkoutSchema = z.object({
  payment: z.enum(["cash", "card"]),
  address: z.discriminatedUnion("mode", [
    z.object({ mode: z.literal("saved"), id: addressIdSchema }),
    z.object({
      mode: z.literal("manual"),
      shippingAddress: shippingAddressSchema,
    }),
  ]),
});
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutResult =
  | { success: true; destination: string; message: string }
  | { success: false; message: string; code?: "login" };

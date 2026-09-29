import { z } from "zod";

export const addressInputSchema = z.object({
  name: z.string().trim().min(1, "Address name is required").max(100),
  details: z.string().trim().min(1, "Address details are required").max(1000),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,25}$/, "Enter a valid phone number")
    .refine(
      (value) => value.replace(/\D/g, "").length >= 7,
      "Enter a valid phone number",
    ),
  city: z.string().trim().min(1, "City is required").max(100),
});
export const addressIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
export const addressSchema = z.object({
  _id: addressIdSchema,
  name: z.string(),
  details: z.string(),
  phone: z.string(),
  city: z.string(),
});
export const addressesResponseSchema = z.object({
  status: z.literal("success"),
  data: z.array(addressSchema),
  results: z.number().nonnegative().optional(),
});
export const addressMutationSchema = addressesResponseSchema.extend({
  message: z.string().trim().min(1),
});
export type AddressInput = z.infer<typeof addressInputSchema>;
export type Address = z.infer<typeof addressSchema>;
export type AddressActionResult =
  | { success: true; message: string }
  | { success: false; message: string; code?: "login" };

import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Enter at least 2 characters.")
      .max(60, "Use at most 60 characters."),
    email: z.email("Enter a valid email address.").trim().max(254),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .max(128)
      .regex(/[A-Za-z]/, "Include a letter.")
      .regex(/[0-9]/, "Include a number.")
      .regex(/[^A-Za-z0-9\s]/, "Include a symbol."),
    rePassword: z.string().min(1, "Confirm your password."),
    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+20|0020|0)1[0125][0-9]{8}$/,
        "Enter a valid Egyptian mobile number, e.g. 01012345678.",
      ),
    terms: z
      .boolean()
      .refine(Boolean, "Please accept the terms and privacy policy."),
  })
  .refine((value) => value.password === value.rePassword, {
    message: "Passwords do not match.",
    path: ["rePassword"],
  });

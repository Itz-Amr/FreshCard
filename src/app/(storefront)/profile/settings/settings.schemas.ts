import { z } from "zod";
import { registerSchema } from "@/app/(auth)/register/register.zod";

export const profileSchema = z.object({
  name: registerSchema.shape.name,
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email("Enter a valid email address.")),
  phone: z
    .string()
    .trim()
    .pipe(z.union([registerSchema.shape.phone, z.literal("")])),
});
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(128),
    password: registerSchema.shape.password,
    rePassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((value) => value.password === value.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match.",
  });
export type ProfileValues = z.infer<typeof profileSchema>;
export type PasswordValues = z.infer<typeof passwordSchema>;
export type ProfileUser = ProfileValues & { role: string };
export type SettingsResult =
  | { success: true; message: string; user?: ProfileUser }
  | { success: false; message: string; code?: "login" };
export function changedProfileFields(
  values: ProfileValues,
  original: ProfileValues,
): Partial<ProfileValues> {
  const changes: Partial<ProfileValues> = {};
  for (const key of ["name", "email", "phone"] as const) {
    if (values[key] !== original[key]) changes[key] = values[key];
  }
  return changes;
}

import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email address.")),
});
export const verifyResetCodeSchema = z.object({
  resetCode: z
    .string()
    .regex(/^\d{6}$/, "Enter the 6-digit code from your email."),
});
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyResetCodeValues = z.infer<typeof verifyResetCodeSchema>;
export type RecoveryResult =
  | {
      success: true;
      message: string;
      next?: "/verify-reset-code" | "/reset-password" | "/login";
    }
  | { success: false; message: string; restart?: true };

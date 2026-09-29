"use server";

import {
  clearRecoveryEmail,
  getRecoveryEmail,
} from "../_recovery/recovery.context";
import type { RecoveryResult } from "../_recovery/recovery.schemas";
import {
  RecoveryApiError,
  resetPassword,
} from "../_recovery/recovery.services";
import { resetPasswordSchema } from "./reset-password.schemas";

export async function resetPasswordAction(
  input: unknown,
): Promise<RecoveryResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Check your new password.",
    };
  try {
    const email = await getRecoveryEmail();
    if (!email)
      return {
        success: false,
        restart: true,
        message:
          "Your recovery session has expired. Please enter your email again.",
      };
    await resetPassword(email, parsed.data.newPassword);
    await clearRecoveryEmail();
    return {
      success: true,
      message: "Password reset successfully. Please sign in.",
      next: "/login",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof RecoveryApiError
          ? error.message
          : "Unable to complete your request right now. Please try again.",
    };
  }
}

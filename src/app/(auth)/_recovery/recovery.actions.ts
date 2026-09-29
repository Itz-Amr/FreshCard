"use server";

import { getRecoveryEmail, saveRecoveryEmail } from "./recovery.context";
import {
  forgotPasswordSchema,
  type RecoveryResult,
  verifyResetCodeSchema,
} from "./recovery.schemas";
import {
  RecoveryApiError,
  sendResetCode,
  verifyResetCode,
} from "./recovery.services";

function failure(error: unknown): RecoveryResult {
  return {
    success: false,
    message:
      error instanceof RecoveryApiError
        ? error.message
        : "Unable to complete your request right now. Please try again.",
  };
}
const restart: RecoveryResult = {
  success: false,
  restart: true,
  message: "Your recovery session has expired. Please enter your email again.",
};

export async function forgotPasswordAction(
  input: unknown,
): Promise<RecoveryResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: "Enter a valid email address." };
  try {
    const message = await sendResetCode(parsed.data.email);
    await saveRecoveryEmail(parsed.data.email);
    return { success: true, message, next: "/verify-reset-code" };
  } catch (error) {
    return failure(error);
  }
}

export async function verifyResetCodeAction(
  input: unknown,
): Promise<RecoveryResult> {
  const parsed = verifyResetCodeSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "Enter the 6-digit code from your email.",
    };
  try {
    const email = await getRecoveryEmail();
    if (!email) return restart;
    await verifyResetCode(parsed.data.resetCode);
    await saveRecoveryEmail(email);
    return {
      success: true,
      message: "Code verified successfully.",
      next: "/reset-password",
    };
  } catch (error) {
    return failure(error);
  }
}

export async function resendResetCodeAction(): Promise<RecoveryResult> {
  try {
    const email = await getRecoveryEmail();
    if (!email) return restart;
    const message = await sendResetCode(email);
    await saveRecoveryEmail(email);
    return { success: true, message };
  } catch (error) {
    return failure(error);
  }
}

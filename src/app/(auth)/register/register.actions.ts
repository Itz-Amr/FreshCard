"use server";

import { AuthApiError } from "@/lib/auth-api";
import type { RegisterResult } from "./register.interface";
import { registerUser } from "./register.services";
import { registerSchema } from "./register.zod";

export async function registerAction(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "Please check your details and try again.",
    };
  try {
    await registerUser(parsed.data);
    return { success: true };
  } catch (error) {
    const message =
      error instanceof AuthApiError && error.kind === "duplicate"
        ? "An account with this email already exists. Please sign in."
        : error instanceof AuthApiError && error.kind === "validation"
          ? "Please check your name, password and mobile number."
          : "We couldn't create your account right now. Please try again shortly.";
    return { success: false, message };
  }
}

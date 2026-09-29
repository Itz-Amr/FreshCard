"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import type { LoginResult } from "./login.interface";
import { loginSchema } from "./login.zod";

export async function loginAction(input: unknown): Promise<LoginResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: "Enter a valid email and password." };
  try {
    await signIn("credentials", {
      ...parsed.data,
      redirect: false,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof AuthError && error.type === "CredentialsSignin"
          ? "Incorrect email or password. Please try again."
          : "Unable to sign in right now. Please try again shortly.",
    };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

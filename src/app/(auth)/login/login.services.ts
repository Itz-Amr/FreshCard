import "server-only";
import { AuthApiError, authRequest } from "@/lib/auth-api";
import { backendExpiry } from "@/lib/token-policy";
import type { LoginValues } from "./login.interface";

export async function loginUser({ email, password, remember }: LoginValues) {
  const result = await authRequest("/auth/signin", { email, password });
  const expiresAt = backendExpiry(result.token);
  if (!expiresAt || expiresAt <= Date.now() / 1000 + 30)
    throw new AuthApiError("credentials");
  return {
    id: result.user.email,
    ...result.user,
    backendToken: result.token,
    backendExpiresAt: expiresAt,
    sessionDeadline: Math.min(
      expiresAt,
      Math.floor(Date.now() / 1000) + (remember ? 30 : 1) * 86400,
    ),
  };
}

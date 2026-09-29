import "server-only";
import { z } from "zod";
import { apiUrl } from "@/lib/auth-api";

export class RecoveryApiError extends Error {}
const unavailable =
  "Unable to complete your request right now. Please try again.";

async function recoveryRequest(
  path: string,
  body: object,
  method: "POST" | "PUT" = "POST",
): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new RecoveryApiError(unavailable);
  }
  const data: unknown = await response.json().catch(() => null);
  const failure = z
    .object({
      message: z.string().trim().min(1).max(1000),
      statusMsg: z.string().optional(),
    })
    .safeParse(data);
  if (!response.ok || (failure.success && failure.data.statusMsg === "fail"))
    throw new RecoveryApiError(
      failure.success ? failure.data.message : unavailable,
    );
  return data;
}

export async function sendResetCode(email: string) {
  const result = z
    .object({
      statusMsg: z.literal("success"),
      message: z.string().trim().min(1),
    })
    .safeParse(await recoveryRequest("/auth/forgotPasswords", { email }));
  if (!result.success) throw new RecoveryApiError(unavailable);
  return result.data.message;
}

export async function verifyResetCode(resetCode: string) {
  const result = z
    .object({ status: z.literal("Success") })
    .safeParse(await recoveryRequest("/auth/verifyResetCode", { resetCode }));
  if (!result.success) throw new RecoveryApiError(unavailable);
}

export async function resetPassword(email: string, newPassword: string) {
  const result = z
    .object({ token: z.string().min(1) })
    .safeParse(
      await recoveryRequest(
        "/auth/resetPassword",
        { email, newPassword },
        "PUT",
      ),
    );
  if (!result.success) throw new RecoveryApiError(unavailable);
  // The reset response token is intentionally discarded, never exposed or used
  // to establish an Auth.js session. The user signs in with their new password.
}

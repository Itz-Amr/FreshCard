import "server-only";
import { z } from "zod";

// Only read expiry metadata from a token received directly from the trusted API.
// Authorization remains the backend's responsibility; this is not signature verification.
export function backendExpiry(token: string): number | null {
  try {
    if (token.split(".").length !== 3) return null;
    const claims: unknown = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    const result = z
      .object({ exp: z.number().int().positive() })
      .safeParse(claims);
    return result.success ? result.data.exp : null;
  } catch {
    return null;
  }
}

export function tokenIsUsable(
  token: {
    backendToken?: string;
    backendExpiresAt?: number;
    sessionDeadline?: number;
  },
  now = Date.now() / 1000,
) {
  return Boolean(
    token.backendToken &&
      token.backendExpiresAt &&
      token.sessionDeadline &&
      token.backendExpiresAt > now + 30 &&
      token.sessionDeadline > now,
  );
}

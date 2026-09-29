import "server-only";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { secureCookies } from "@/authConfig/authConfig";
import { apiUrl } from "./auth-api";
import { tokenIsUsable } from "./token-policy";

export class SessionRequiredError extends Error {
  constructor() {
    super("Please sign in again.");
    this.name = "SessionRequiredError";
  }
}

export async function requireBackendToken() {
  const requestHeaders = await headers();
  const token = await getToken({
    req: {
      headers: new Headers({ cookie: requestHeaders.get("cookie") ?? "" }),
    },
    secret: process.env.AUTH_SECRET,
    secureCookie: secureCookies,
  });
  if (!token || !tokenIsUsable(token) || !token.backendToken)
    throw new SessionRequiredError();
  return token.backendToken;
}

// Read identity only from the API-issued JWT inside the authenticated, encrypted
// server session. This decodes metadata; backend authorization still applies.
export async function requireBackendUserId() {
  const token = await requireBackendToken();
  try {
    const claims: unknown = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    if (
      claims &&
      typeof claims === "object" &&
      "id" in claims &&
      typeof claims.id === "string" &&
      /^[a-f\d]{24}$/i.test(claims.id)
    )
      return claims.id;
  } catch {
    // Invalid identity fails closed without logging private token data.
  }
  throw new SessionRequiredError();
}

// Server-only transport. Call inside protected actions/services, and handle
// SessionRequiredError by requiring a new sign-in, never by retrying anonymously.
export async function fetchAuthenticated(
  path: string,
  init: RequestInit = {},
  version: "v1" | "v2" = "v1",
) {
  const token = await requireBackendToken();
  const requestHeaders = new Headers(init.headers);
  requestHeaders.set("token", token);
  const response = await fetch(apiUrl(path, version), {
    ...init,
    headers: requestHeaders,
    cache: "no-store",
    redirect: "error",
    signal: init.signal ?? AbortSignal.timeout(15_000),
  });
  if (response.status === 401) throw new SessionRequiredError();
  return response;
}

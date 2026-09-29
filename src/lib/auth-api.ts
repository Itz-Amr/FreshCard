import "server-only";
import { z } from "zod";

export class AuthApiError extends Error {
  constructor(
    public readonly kind:
      | "credentials"
      | "duplicate"
      | "validation"
      | "unavailable",
  ) {
    super(kind);
    this.name = "AuthApiError";
  }
}

export const authResponseSchema = z.object({
  message: z.literal("success"),
  user: z.object({ name: z.string(), email: z.email(), role: z.string() }),
  token: z.string().min(1),
});

export function apiUrl(path: string, version: "v1" | "v2" = "v1") {
  const base = process.env.API_BASE_URL;
  if (!base) throw new AuthApiError("unavailable");
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    throw new Error("Expected a relative API endpoint.");
  }
  let root = base.replace(/\/$/, "");
  if (version === "v2") {
    if (!root.endsWith("/api/v1")) throw new AuthApiError("unavailable");
    root = root.replace(/\/api\/v1$/, "/api/v2");
  }
  return `${root}${path}`;
}

export async function authRequest(
  path: "/auth/signup" | "/auth/signin",
  body: object,
) {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new AuthApiError("unavailable");
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (path === "/auth/signin" && [400, 401, 404].includes(response.status))
      throw new AuthApiError("credentials");
    // Inspect only the error category; never echo an arbitrary backend payload.
    const error = z.object({ message: z.string() }).safeParse(data);
    if (
      response.status === 409 ||
      (error.success && /already exist/i.test(error.data.message))
    )
      throw new AuthApiError("duplicate");
    if ([400, 422].includes(response.status))
      throw new AuthApiError("validation");
    throw new AuthApiError("unavailable");
  }
  const parsed = authResponseSchema.safeParse(data);
  if (
    !parsed.success ||
    response.status !== (path === "/auth/signup" ? 201 : 200)
  )
    throw new AuthApiError("unavailable");
  return parsed.data;
}

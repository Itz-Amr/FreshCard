import "server-only";
import { cookies } from "next/headers";
import { decode, encode } from "next-auth/jwt";
import { forgotPasswordSchema } from "./recovery.schemas";

const cookieName = "freshcart.recovery";
const lifetime = 30 * 60;
const salt = "freshcart-password-recovery-v1";

// Separate encrypted flow context, never an authentication or reset credential.
// The backend alone decides whether a reset code/password reset is authorized.
export async function saveRecoveryEmail(email: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Recovery configuration unavailable");
  const value = await encode({
    secret,
    salt,
    token: { email },
    maxAge: lifetime,
  });
  (await cookies()).set(cookieName, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: lifetime,
  });
}

export async function getRecoveryEmail(): Promise<string | null> {
  const token = (await cookies()).get(cookieName)?.value;
  const secret = process.env.AUTH_SECRET;
  if (!token || !secret) return null;
  try {
    const payload = await decode({ token, secret, salt });
    const parsed = forgotPasswordSchema.safeParse(payload);
    return parsed.success ? parsed.data.email : null;
  } catch {
    return null;
  }
}

export async function clearRecoveryEmail() {
  (await cookies()).delete(cookieName);
}

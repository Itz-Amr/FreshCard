import "server-only";
import { z } from "zod";
import { fetchAuthenticated } from "@/lib/backend";
import { backendExpiry } from "@/lib/token-policy";
import {
  type PasswordValues,
  type ProfileValues,
  passwordSchema,
  profileSchema,
} from "./settings.schemas";

export class SettingsApiError extends Error {}
export class PasswordSessionError extends SettingsApiError {}
const unavailable = "Unable to save your changes. Please try again.";
const userSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  role: z.string(),
  phone: z.string().optional(),
});
const successSchema = z.object({
  message: z.literal("success"),
  user: userSchema,
});
async function request(path: string, body: object) {
  const response = await fetchAuthenticated(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: unknown = await response.json().catch(() => null);
  const error = z
    .object({
      message: z.string().optional(),
      errors: z.object({ msg: z.string() }).optional(),
    })
    .safeParse(data);
  if (!response.ok || (error.success && error.data.message === "fail")) {
    const message = error.success
      ? (error.data.errors?.msg ?? error.data.message)
      : undefined;
    throw new SettingsApiError(
      message && message !== "fail" ? message.slice(0, 1000) : unavailable,
    );
  }
  return data;
}
export async function updateProfile(changes: Partial<ProfileValues>) {
  const payload = profileSchema.partial().parse(changes);
  const parsed = successSchema.safeParse(
    await request("/users/updateMe/", payload),
  );
  if (!parsed.success) throw new SettingsApiError(unavailable);
  return parsed.data;
}
export async function changePassword(values: PasswordValues) {
  const body = passwordSchema.parse(values);
  const parsed = successSchema
    .extend({ token: z.string().min(1) })
    .safeParse(await request("/users/changeMyPassword", body));
  if (!parsed.success)
    throw new PasswordSessionError(
      "The password response could not be verified. Please sign in again.",
    );
  const expiresAt = backendExpiry(parsed.data.token);
  if (!expiresAt || expiresAt <= Date.now() / 1000 + 30)
    throw new PasswordSessionError(
      "Your password changed, but the new session could not be verified. Please sign in again.",
    );
  return { ...parsed.data, expiresAt };
}

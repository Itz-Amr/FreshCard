"use server";
import { revalidatePath } from "next/cache";
import { auth, signOut, updateSession } from "@/auth";
import { withTrustedAuthUpdate } from "@/lib/auth-update-context";
import { requireBackendToken, SessionRequiredError } from "@/lib/backend";
import {
  changedProfileFields,
  passwordSchema,
  profileSchema,
  type SettingsResult,
} from "./settings.schemas";
import {
  changePassword,
  PasswordSessionError,
  SettingsApiError,
  updateProfile,
} from "./settings.services";

function failure(error: unknown): SettingsResult {
  if (error instanceof SessionRequiredError)
    return { success: false, code: "login", message: "Please sign in again." };
  return {
    success: false,
    message:
      error instanceof SettingsApiError
        ? error.message
        : "Unable to save your changes. Please try again.",
  };
}
export async function updateProfileAction(
  input: unknown,
): Promise<SettingsResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: parsed.error.issues[0].message };
  let saved = false;
  try {
    await requireBackendToken();
    const session = await auth();
    if (!session?.user) throw new SessionRequiredError();
    const original = {
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      phone: session.user.phone ?? "",
    };
    const changes = changedProfileFields(parsed.data, original);
    if (changes.phone === "")
      return { success: false, message: "Enter a valid phone number." };
    if (!Object.keys(changes).length)
      return { success: true, message: "No changes to save." };
    const response = await updateProfile(changes);
    saved = true;
    const user = {
      ...response.user,
      phone: response.user.phone ?? changes.phone ?? original.phone,
    };
    const synced = await withTrustedAuthUpdate(
      { subject: session.user.id, user },
      () => updateSession({}),
    );
    if (
      !synced?.user ||
      synced.user.name !== user.name ||
      synced.user.email !== user.email
    ) {
      await signOut({ redirect: false });
      return {
        success: false,
        code: "login",
        message:
          "Your profile was saved. Please sign in again to refresh your session.",
      };
    }
    revalidatePath("/", "layout");
    return { success: true, message: response.message, user };
  } catch (error) {
    if (saved) {
      await signOut({ redirect: false });
      return {
        success: false,
        code: "login",
        message:
          "Your profile was saved. Please sign in again to refresh your session.",
      };
    }
    return failure(error);
  }
}
export async function changePasswordAction(
  input: unknown,
): Promise<SettingsResult> {
  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: parsed.error.issues[0].message };
  let changed = false;
  try {
    await requireBackendToken();
    const session = await auth();
    if (!session?.user) throw new SessionRequiredError();
    const response = await changePassword(parsed.data);
    changed = true;
    const synced = await withTrustedAuthUpdate(
      {
        subject: session.user.id,
        user: response.user,
        backendToken: response.token,
        backendExpiresAt: response.expiresAt,
      },
      () => updateSession({}),
    );
    if (!synced?.user) throw new Error("Session update failed");
    revalidatePath("/", "layout");
    return { success: true, message: response.message };
  } catch (error) {
    if (changed || error instanceof PasswordSessionError) {
      await signOut({ redirect: false });
      return {
        success: false,
        code: "login",
        message:
          error instanceof PasswordSessionError
            ? error.message
            : "Your password changed. Please sign in again to refresh your session.",
      };
    }
    return failure(error);
  }
}

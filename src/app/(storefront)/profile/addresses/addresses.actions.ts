"use server";
import { revalidatePath } from "next/cache";
import { SessionRequiredError } from "@/lib/backend";
import {
  type AddressActionResult,
  addressIdSchema,
  addressInputSchema,
} from "./addresses.schemas";
import {
  AddressApiError,
  addAddress,
  deleteAddress,
} from "./addresses.services";

function failure(error: unknown): AddressActionResult {
  if (error instanceof SessionRequiredError)
    return { success: false, code: "login", message: "Please sign in again." };
  return {
    success: false,
    message:
      error instanceof AddressApiError
        ? error.message
        : "Unable to complete your address request. Please try again.",
  };
}
export async function addAddressAction(
  input: unknown,
): Promise<AddressActionResult> {
  const parsed = addressInputSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, message: parsed.error.issues[0].message };
  try {
    const message = await addAddress(parsed.data);
    revalidatePath("/profile/addresses");
    return { success: true, message };
  } catch (error) {
    return failure(error);
  }
}
export async function deleteAddressAction(
  input: unknown,
): Promise<AddressActionResult> {
  const parsed = addressIdSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Invalid address." };
  try {
    const message = await deleteAddress(parsed.data);
    revalidatePath("/profile/addresses");
    return { success: true, message };
  } catch (error) {
    return failure(error);
  }
}

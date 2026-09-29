"use server";
import { revalidatePath } from "next/cache";
import { SessionRequiredError } from "@/lib/backend";
import { type CheckoutResult, checkoutSchema } from "./checkout.schemas";
import { CheckoutError, placeCheckout } from "./checkout.services";

export async function checkoutAction(input: unknown): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      message: "Please check your delivery address and payment method.",
    };
  try {
    const result = await placeCheckout(parsed.data);
    return { success: true, ...result };
  } catch (error) {
    if (error instanceof SessionRequiredError)
      return {
        success: false,
        code: "login",
        message: "Please sign in again to continue checkout.",
      };
    return {
      success: false,
      message:
        error instanceof CheckoutError
          ? error.message
          : "Unable to confirm checkout. Check My Orders and your cart before retrying.",
    };
  } finally {
    // Reconcile consumed carts, including an ambiguous cash response. Stripe
    // session creation alone must never clear or invalidate the cart as paid.
    if (parsed.data.payment === "cash") revalidatePath("/", "layout");
  }
}

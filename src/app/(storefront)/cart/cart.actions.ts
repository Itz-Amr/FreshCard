"use server";
import { revalidatePath } from "next/cache";
import { SessionRequiredError } from "@/lib/backend";
import { CartError, mutateCart } from "./cart.services";
import {
  type CartActionResult,
  type CartCommand,
  cartCommandSchema,
} from "./cart.types";

export async function updateCartAction(
  input: CartCommand,
): Promise<CartActionResult> {
  const parsed = cartCommandSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      code: "error",
      message: "Please check your cart request.",
    };
  try {
    await mutateCart(parsed.data);
    const messages = {
      add: "Added to your cart.",
      update: "Cart quantity updated.",
      remove: "Removed from your cart.",
      clear: "Your cart is now empty.",
      coupon: "Coupon applied.",
    };
    return { success: true, message: messages[parsed.data.type] };
  } catch (error) {
    if (error instanceof SessionRequiredError)
      return {
        success: false,
        code: "login",
        message: "Please sign in to use your cart.",
      };
    return {
      success: false,
      code: "error",
      message:
        error instanceof CartError
          ? error.message
          : "Couldn't update your cart. Please refresh and try again.",
    };
  } finally {
    // Also reconcile partial writes and stock changes after a failed mutation.
    revalidatePath("/", "layout");
  }
}

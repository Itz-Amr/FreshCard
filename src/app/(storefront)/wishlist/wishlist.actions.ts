"use server";

import { revalidatePath } from "next/cache";
import { SessionRequiredError } from "@/lib/backend";
import { setWishlistProduct } from "./wishlist.services";
import {
  type WishlistActionResult,
  wishlistProductIdSchema,
} from "./wishlist.types";

export async function updateWishlistAction(
  productId: string,
  saved: boolean,
): Promise<WishlistActionResult> {
  if (
    !wishlistProductIdSchema.safeParse(productId).success ||
    typeof saved !== "boolean"
  ) {
    return {
      success: false,
      code: "error",
      message: "Invalid wishlist request.",
    };
  }
  try {
    await setWishlistProduct(productId, saved);
  } catch (error) {
    if (error instanceof SessionRequiredError) {
      return {
        success: false,
        code: "login",
        message: "Please sign in to use your wishlist.",
      };
    }
    return {
      success: false,
      code: "error",
      message: "Couldn't update your wishlist. Please try again.",
    };
  }
  revalidatePath("/", "layout");
  return { success: true };
}

import "server-only";
import { cache } from "react";
import { fetchAuthenticated, SessionRequiredError } from "@/lib/backend";
import {
  type WishlistSnapshot,
  wishlistAddResponseSchema,
  wishlistProductIdSchema,
  wishlistResponseSchema,
} from "./wishlist.types";

export const getWishlist = cache(async () => {
  const response = await fetchAuthenticated("/wishlist");
  if (!response.ok) throw new Error("Unable to load wishlist.");
  return wishlistResponseSchema.parse(await response.json());
});

export async function getWishlistSnapshot(): Promise<WishlistSnapshot> {
  try {
    const wishlist = await getWishlist();
    return {
      status: "ready",
      ids: wishlist.data.map((product) => product._id),
      count: wishlist.count,
    };
  } catch (error) {
    return {
      status: error instanceof SessionRequiredError ? "guest" : "unavailable",
    };
  }
}

export async function setWishlistProduct(productId: string, saved: boolean) {
  const id = wishlistProductIdSchema.parse(productId);
  const response = await fetchAuthenticated(
    saved ? "/wishlist" : `/wishlist/${id}`,
    saved
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        }
      : { method: "DELETE" },
  );
  if (!response.ok) throw new Error("Unable to update wishlist.");
  if (saved) {
    wishlistAddResponseSchema.parse(await response.json());
  } else {
    // DELETE has no documented body contract; a successful status is sufficient.
    await response.json().catch(() => null);
  }
}

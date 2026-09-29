"use client";

import Image from "next/image";
import ProductIcon from "@/components/catalog/ProductIcon";
import { Icon } from "@/components/shared/storefront-ui";
import { useWishlist } from "./WishlistProvider";

export default function WishlistButton({
  productId,
  title,
  variant = "card",
}: {
  productId: string;
  title: string;
  variant?: "card" | "details" | "remove";
}) {
  const { snapshot, pending, pendingId, update } = useWishlist();
  const saved = snapshot.status === "ready" && snapshot.ids.includes(productId);
  const removing = variant === "remove" || saved;
  const busy = pending && pendingId === productId;
  return (
    <button
      type="button"
      className={`wishlist-action ${variant === "card" ? "icon-button" : variant === "remove" ? "wishlist-remove" : "wishlist-details-toggle"}`}
      aria-label={`${removing ? "Remove" : "Add"} ${title} ${removing ? "from" : "to"} wishlist`}
      aria-pressed={variant === "remove" ? undefined : saved}
      aria-busy={busy}
      disabled={pending}
      onClick={() => update(productId, !removing)}
    >
      {busy ? (
        <span className="wishlist-spinner" aria-hidden="true" />
      ) : variant === "remove" || saved ? (
        <Image
          src={`/assets/wishlist/${variant === "remove" ? "trash" : "heart-filled"}.svg`}
          alt=""
          width={variant === "remove" ? 18 : 25}
          height={variant === "remove" ? 14 : 20}
          unoptimized
        />
      ) : variant === "details" ? (
        <ProductIcon name="heart" />
      ) : (
        <Icon name="saveProduct" />
      )}
      {variant === "details" &&
        (busy
          ? "Updating…"
          : saved
            ? "Remove from Wishlist"
            : "Add to Wishlist")}
    </button>
  );
}
